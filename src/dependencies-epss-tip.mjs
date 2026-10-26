// The explanations behind terms in the Dependencies panel: every "EPSS 0.5 %",
// the vulnerability tile's number and its "cleared". A toggletip rather than a title or a CSS ::after tooltip, because it has to
// hold a link and open on tap: hover shows it, keyboard focus shows it, a
// click or tap pins it, Escape or a press outside closes it. One shared
// popup, moved next to whichever trigger is active so Tab reaches its link,
// and placed with fixed coordinates so the table's scroll box cannot clip it.

import { el } from './html-utils.mjs';
import { epssLabel } from './dependencies-panel-model.mjs';

export const EPSS_TIP_LINES = [
  'Estimated exploitation likelihood within the next 30 days.',
  'This is not your wallet’s chance of being hacked.',
];
export const EPSS_LEARN_MORE_URL = 'https://www.first.org/epss/';

const TIP_ID = 'dp-tip';
const MARGIN = 8; // px kept free from the viewport edges
const GAP = 6; // px between the trigger and the tip
const HOVER_CLOSE_DELAY = 150; // ms to move the mouse from the trigger into the tip

let state = null; // { tip, trigger, pinned, closeTimer, refocusing }
const contents = new WeakMap(); // trigger -> () => the tip's children

function ensureTip(doc) {
  if (state && state.tip.ownerDocument === doc) return state;
  const tip = el('div', { id: TIP_ID, className: 'dp-tip', hidden: true });
  state = { tip, trigger: null, pinned: false, closeTimer: null };

  tip.addEventListener('mouseenter', () => clearTimeout(state.closeTimer));
  tip.addEventListener('mouseleave', () => { if (!state.pinned) scheduleClose(); });
  tip.addEventListener('focusout', onFocusOut);
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !state.trigger) return;
    const back = state.tip.contains(doc.activeElement) ? state.trigger : null;
    closeTip();
    if (back) {
      state.refocusing = true; // keep its focus handler from reopening the tip
      back.focus();
      state.refocusing = false;
    }
  });
  doc.addEventListener('pointerdown', (e) => {
    if (!state.trigger) return;
    if (state.tip.contains(e.target) || state.trigger.contains(e.target)) return;
    closeTip();
  });
  const view = doc.defaultView;
  view?.addEventListener('scroll', () => { if (state.trigger) place(); }, { capture: true, passive: true });
  view?.addEventListener('resize', () => { if (state.trigger) place(); });
  return state;
}

function onFocusOut(e) {
  const next = e.relatedTarget;
  if (!state.trigger || (next && (state.tip.contains(next) || state.trigger.contains(next)))) return;
  // Focus left both: a keyboard user tabbed on. A tap elsewhere is handled by pointerdown.
  if (next) closeTip();
}

function scheduleClose() {
  clearTimeout(state.closeTimer);
  state.closeTimer = setTimeout(closeTip, HOVER_CLOSE_DELAY);
}

export function closeTip() {
  if (!state?.trigger) return;
  clearTimeout(state.closeTimer);
  state.trigger.setAttribute('aria-expanded', 'false');
  state.tip.hidden = true;
  state.trigger = null;
  state.pinned = false;
}

function openTip(trigger, pinned) {
  const s = ensureTip(trigger.ownerDocument);
  clearTimeout(s.closeTimer);
  if (s.trigger && s.trigger !== trigger) closeTip();
  s.pinned = s.pinned || pinned;
  if (s.trigger === trigger) return;
  s.trigger = trigger;
  s.tip.replaceChildren(...contents.get(trigger)());
  trigger.after(s.tip);
  trigger.setAttribute('aria-expanded', 'true');
  s.tip.hidden = false;
  place();
}

// Below the trigger, or above it when there is no room below; shifted
// sideways to stay inside the viewport.
function place() {
  const { tip, trigger } = state;
  const view = tip.ownerDocument.defaultView;
  if (!view || typeof trigger.getBoundingClientRect !== 'function') return;
  const r = trigger.getBoundingClientRect();
  const vw = view.innerWidth;
  const vh = view.innerHeight;
  const w = tip.offsetWidth;
  const h = tip.offsetHeight;
  let top = r.bottom + GAP;
  if (top + h > vh - MARGIN && r.top - GAP - h >= MARGIN) top = r.top - GAP - h;
  const left = Math.min(Math.max(MARGIN, r.left), Math.max(MARGIN, vw - MARGIN - w));
  tip.style.top = `${Math.round(top)}px`;
  tip.style.left = `${Math.round(left)}px`;
}

// A button showing `label` that opens the shared tip with `content()`, a list
// of nodes built when it opens.
export function tipTrigger(label, content, { className = 'dp-term' } = {}) {
  const trigger = el('button', {
    type: 'button',
    className,
    'aria-expanded': 'false',
    'aria-controls': TIP_ID,
  }, label);
  contents.set(trigger, content);
  trigger.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') openTip(trigger, false); });
  trigger.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && state?.trigger === trigger && !state.pinned) scheduleClose(); });
  trigger.addEventListener('focus', () => {
    // Keyboard focus only; a tap also focuses, and its click toggles below.
    let keyboard = true;
    try { keyboard = trigger.matches(':focus-visible'); } catch { /* no selector support */ }
    if (keyboard && !state?.refocusing) openTip(trigger, true);
  });
  trigger.addEventListener('focusout', (e) => { if (state) onFocusOut(e); });
  trigger.addEventListener('click', () => {
    if (state?.trigger === trigger && state.pinned) closeTip();
    else openTip(trigger, true);
  });
  return trigger;
}

// "EPSS 0.5 %" as a button that opens the shared tip.
export function epssTrigger(epss, percentile) {
  const pct = percentile != null ? Math.round(percentile * 100) : null;
  return tipTrigger(`EPSS ${epssLabel(epss)}`, () => [
    ...EPSS_TIP_LINES.map(line => el('p', {}, line)),
    el('p', { className: 'dp-tip__percentile', hidden: pct == null }, pct == null ? '' : `Higher than ${pct} % of all scored CVEs.`),
    el('a', { href: EPSS_LEARN_MORE_URL, target: '_blank', rel: 'noopener noreferrer' }, 'Learn more'),
  ], { className: 'dp-epss' });
}
