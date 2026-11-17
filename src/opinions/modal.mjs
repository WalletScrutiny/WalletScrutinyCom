import { el } from '../html-utils.mjs';
import { wsIcon } from '../icon.mjs';

let current = null;

/**
 * Small centred dialog in the style of the zap modal. `body` is an element;
 * resolves to whatever `close(value)` was called with (undefined on dismiss).
 */
export function openModal({ title, body, className = '' }) {
  closeModal();
  return new Promise((resolve) => {
    const closeButton = el('button', {
      type: 'button',
      className: 'opinions-modal__close',
      'aria-label': 'Close',
      html: wsIcon('xmark'),
    });
    const dialog = el('div', { className: `opinions-modal__dialog ${className}`.trim(), role: 'dialog', 'aria-modal': 'true' },
      closeButton,
      title ? el('h3', { className: 'opinions-modal__title' }, title) : null,
      body,
    );
    const overlay = el('div', { className: 'opinions-modal' }, dialog);

    const onKey = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    function close(value) {
      if (current?.overlay !== overlay) {
        return;
      }
      overlay.remove();
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('opinions-modal-open');
      current = null;
      resolve(value);
    }
    closeButton.addEventListener('click', () => close());
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        close();
      }
    });
    window.addEventListener('keydown', onKey);
    document.body.classList.add('opinions-modal-open');
    document.body.appendChild(overlay);
    current = { overlay, close };
  });
}

export function closeModal(value) {
  current?.close(value);
}

/** Yes/no question; resolves true only on confirmation. */
export function confirmModal({ title, message, confirmLabel = 'Agree', cancelLabel = 'Cancel' }) {
  const confirmButton = el('button', { type: 'button', className: 'opinions-btn opinions-btn--primary' }, confirmLabel);
  const cancelButton = el('button', { type: 'button', className: 'opinions-btn' }, cancelLabel);
  const body = el('div', {},
    ...[].concat(message).map((line) => el('p', {}, line)),
    el('div', { className: 'opinions-modal__actions' }, cancelButton, confirmButton),
  );
  const result = openModal({ title, body });
  confirmButton.addEventListener('click', () => closeModal(true));
  cancelButton.addEventListener('click', () => closeModal(false));
  return result.then((value) => value === true);
}
