// The Dependencies panel's summary tiles and the dependencies-per-version
// chart (dependencies-panel.mjs).

import { el } from './html-utils.mjs';

export function tile(value, label, { tone = '', sub = null, extra = null } = {}) {
  return el('div', { className: `dp-tile${tone ? ` dp-tile--${tone}` : ''}` },
    el('div', { className: 'dp-tile__value' }, value == null ? '–' : typeof value === 'object' ? value : String(value)),
    el('div', { className: 'dp-tile__label' }, label),
    [sub].flat().some(Boolean) ? el('div', { className: 'dp-tile__sub' }, sub) : null,
    extra,
  );
}

// The y axis around the counts, a little wider than their range, so a rise or
// a drop shows instead of a flat line far above zero: round ends, about four
// steps of 1, 2 or 5 times a power of ten, never below zero.
export function historyScale(min, max) {
  const span = max - min || max * 0.1 || 1;
  const lo = min - span * 0.15;
  const hi = max + span * 0.15;
  const raw = (hi - lo) / 4;
  const pow = 10 ** Math.max(0, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map(m => m * pow).find(v => v >= raw);
  return { bottom: Math.max(0, Math.floor(lo / step) * step), top: Math.ceil(hi / step) * step, step };
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
};

const fmt = (v) => v.toLocaleString('en-US');
export const historyPointText = (p, key = 'total') => (key === 'direct'
  ? `${p.ref}: ${fmt(p.direct)} direct dependencies (${fmt(p.total)} in all)`
  : `${p.ref}: ${fmt(p.total)} dependencies${p.direct != null ? ` (${fmt(p.direct)} direct)` : ''}`);

const HISTORY_SERIES = [['total', 'All'], ['direct', 'Direct']];

// The count of every analysed release as a line, oldest left, with tabs for
// all dependencies or only the direct ones. Hovering (or the arrow keys) shows
// one release's version and count; the release the panel shows has its own
// colour and a "Currently selected" label. Positions are percentages, so the
// chart follows the tile's width; the line is the only SVG.
export function historyChart(history) {
  if (!history || history.length < 2) return null;
  const series = HISTORY_SERIES.map(([key, name]) => ({ key, name, points: history.filter(p => p[key] != null) }))
    .filter(sr => sr.points.length >= 2);
  const slot = el('div', { className: 'dp-history__slot' });
  const tabs = series.map((sr, i) => {
    const tab = el('button', { type: 'button', className: 'dp-history__tab', role: 'tab', 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1' }, sr.name);
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const j = (i + 1) % tabs.length;
      select(j); tabs[j].focus(); e.preventDefault();
    });
    return tab;
  });
  const chart = el('div', { className: 'dp-history' },
    el('div', { className: 'dp-history__head' },
      el('span', { className: 'dp-history__title' }, 'Dependencies per version'),
      tabs.length > 1 ? el('span', { className: 'dp-history__tabs', role: 'tablist', 'aria-label': 'Which dependencies' }, tabs) : null,
    ),
    slot,
  );
  let plot = null;
  function select(i) {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    plot = historyPlot(series[i].points, series[i].key, chart);
    slot.replaceChildren(plot);
    plot.placeLabel();
  }
  select(0);
  // the label needs the laid-out width, which the chart only has once it is on the page
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => plot.placeLabel()).observe(chart);
  return chart;
}

function historyPlot(history, key, chart) {
  const n = history.length;
  const totals = history.map(p => p[key]);
  const { bottom, top, step } = historyScale(Math.min(...totals), Math.max(...totals));
  const xOf = (i) => (i / (n - 1)) * 100;
  const yOf = (v) => 100 - ((v - bottom) / (top - bottom)) * 100;

  const svg = svgEl('svg', { class: 'dp-history__lines', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  const yLabels = [];
  for (let v = bottom; v <= top; v += step) {
    svg.appendChild(svgEl('line', { x1: 0, x2: 100, y1: yOf(v), y2: yOf(v), class: 'dp-history__grid', 'vector-effect': 'non-scaling-stroke' }));
    yLabels.push(el('span', { className: 'dp-history__ylabel', style: { top: `${yOf(v)}%` } }, v.toLocaleString('en-US')));
  }
  svg.appendChild(svgEl('polyline', {
    points: history.map((p, i) => `${xOf(i)},${yOf(p[key])}`).join(' '),
    class: 'dp-history__line', 'vector-effect': 'non-scaling-stroke',
  }));
  const dots = history.map((p, i) => el('span', {
    className: `dp-history__dot${p.current ? ' dp-history__dot--current' : ''}`,
    style: { left: `${xOf(i)}%`, top: `${yOf(p[key])}%` },
  }));
  // the release the panel shows, named next to its dot: below it when the dot is near the top
  const at = history.findIndex(p => p.current);
  const currentLabel = at < 0 ? null : el('span', {
    className: 'dp-history__current',
    style: { left: `${xOf(at)}%`, top: `${yOf(history[at][key])}%` },
    dataset: { side: yOf(history[at][key]) < 40 ? 'below' : 'above' },
  }, 'Currently', el('br'), 'selected');
  // centred on its dot, and only pushed sideways as far as it takes to stay inside the plot
  const placeLabel = () => {
    if (!currentLabel) return;
    const pw = plot.clientWidth;
    const lw = currentLabel.offsetWidth;
    if (!pw || !lw) return;
    const x = (xOf(at) / 100) * pw;
    currentLabel.style.left = `${Math.max(-6, Math.min(x - lw / 2, pw - lw + 6))}px`;
    currentLabel.classList.add('dp-history__current--placed');
  };
  const cross = el('span', { className: 'dp-history__cross', hidden: true });
  const tip = el('span', { className: 'dp-history__tip', role: 'status', hidden: true });

  const first = history[0];
  const last = history[n - 1];
  const plot = el('div', {
    className: 'dp-history__plot',
    tabindex: '0',
    'aria-label': `${key === 'direct' ? 'Direct dependencies' : 'Dependencies'} per version, ${n} versions, from ${first[key]} in ${first.ref} to ${last[key]} in ${last.ref}. Use the arrow keys to read each version.`,
  }, svg, cross, dots, currentLabel, tip);

  let shown = -1;
  const show = (i) => {
    if (i === shown) return;
    if (shown >= 0) dots[shown].classList.remove('dp-history__dot--hover');
    shown = i;
    if (i < 0) { cross.hidden = true; tip.hidden = true; return; }
    const x = xOf(i);
    dots[i].classList.add('dp-history__dot--hover');
    cross.hidden = false;
    cross.style.left = `${x}%`;
    tip.hidden = false;
    tip.textContent = historyPointText(history[i], key);
    // centred on the point but kept inside the chart, over the axis labels if need be
    const p = plot.getBoundingClientRect();
    const c = chart.getBoundingClientRect();
    const tw = tip.offsetWidth;
    tip.style.left = `${Math.max(Math.min((x / 100) * p.width - tw / 2, c.right - p.left - tw), c.left - p.left)}px`;
  };
  const indexAt = (clientX) => {
    const r = plot.getBoundingClientRect();
    if (!r.width) return -1;
    return Math.max(0, Math.min(n - 1, Math.round(((clientX - r.left) / r.width) * (n - 1))));
  };
  plot.addEventListener('pointermove', (e) => show(indexAt(e.clientX)));
  plot.addEventListener('pointerdown', (e) => show(indexAt(e.clientX)));
  plot.addEventListener('pointerleave', () => { if (document.activeElement !== plot) show(-1); });
  plot.addEventListener('focus', () => show(shown >= 0 ? shown : (at >= 0 ? at : n - 1)));
  plot.addEventListener('blur', () => show(-1));
  plot.addEventListener('keydown', (e) => {
    const next = e.key === 'ArrowLeft' ? shown - 1 : e.key === 'ArrowRight' ? shown + 1
      : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : null;
    if (next == null) return;
    e.preventDefault();
    show(Math.max(0, Math.min(n - 1, next)));
  });

  const body = el('div', { className: 'dp-history__body' },
    el('div', { className: 'dp-history__yaxis', 'aria-hidden': 'true' }, yLabels),
    plot,
    el('div', { className: 'dp-history__xaxis', 'aria-hidden': 'true' }, el('span', {}, first.ref), el('span', {}, last.ref)),
  );
  body.placeLabel = placeLabel;
  return body;
}

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
