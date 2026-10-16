/**
 * Opinion editor: ToastUI markdown editor loaded on demand (it is by far the
 * largest dependency and most visitors only read), with a plain textarea while
 * it loads or if the chunk cannot be fetched. Replies use the textarea only.
 */
import { el } from '../html-utils.mjs';
import { showToast } from '../verifications_utils.mjs';
import {
  SENTIMENTS,
  SENTIMENT_LABELS,
  SENTIMENT_NEUTRAL,
  maxOpinionLength,
  maxReplyLength,
} from './constants.mjs';
import { sentimentIcon } from './icons.mjs';

const TOASTUI_STYLE_ID = 'opinions-toastui-style';
let toastUiPromise = null;

function isDarkTheme() {
  return document.body.classList.contains('dark') || window.theme === 'dark';
}

function loadToastUi() {
  // The chunk names are matched by performance.assetFilter in
  // webpack.config.js: this editor is the one asset allowed over the size hint.
  toastUiPromise ??= Promise.all([
    import(/* webpackChunkName: "opinions-editor" */ '@drenso-toast-ui/editor'),
    import(/* webpackChunkName: "opinions-editor-css" */ '@drenso-toast-ui/editor/dist/toastui-editor.css'),
    import(/* webpackChunkName: "opinions-editor-dark-css" */ '@drenso-toast-ui/editor/dist/theme/toastui-editor-dark.css'),
  ]).then(([editorModule, lightCss, darkCss]) => {
    if (!document.getElementById(TOASTUI_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = TOASTUI_STYLE_ID;
      style.textContent = `${lightCss.default}\n${darkCss.default}`;
      document.head.appendChild(style);
    }
    return editorModule.default ?? editorModule.Editor;
  });
  return toastUiPromise;
}

function createTextarea({ value, placeholder, maxLength, rows }) {
  const textarea = el('textarea', {
    className: 'opinions-textarea',
    placeholder,
    maxlength: String(maxLength),
    rows: String(rows),
  });
  textarea.value = value;
  return textarea;
}

/** Buttons for the overall sentiment; `get()` returns the selected value. */
function createSentimentPicker(initial) {
  let selected = SENTIMENTS.includes(initial) ? initial : SENTIMENT_NEUTRAL;
  const buttons = SENTIMENTS.map((sentiment) => {
    const button = el('button', {
      type: 'button',
      className: 'opinions-sentiment-btn',
      dataset: { sentiment },
      'aria-pressed': String(sentiment === selected),
    });
    button.innerHTML = sentimentIcon(sentiment);
    button.appendChild(el('span', {}, SENTIMENT_LABELS[sentiment]));
    button.addEventListener('click', () => {
      selected = sentiment;
      for (const other of buttons) {
        other.setAttribute('aria-pressed', String(other.dataset.sentiment === selected));
      }
    });
    return button;
  });
  const element = el('div', { className: 'opinions-sentiment' },
    el('span', { className: 'opinions-sentiment__label' }, 'Your overall sentiment'),
    el('div', { className: 'opinions-sentiment__buttons' }, ...buttons),
  );
  return { element, get: () => selected };
}

function runSubmit(button, work) {
  button.disabled = true;
  button.classList.add('is-busy');
  return Promise.resolve()
    .then(work)
    .catch((error) => {
      console.error('opinions: publish failed', error);
      showToast(error?.message || 'Could not publish, please try again.', 'error');
    })
    .finally(() => {
      button.disabled = false;
      button.classList.remove('is-busy');
    });
}

/**
 * Full opinion editor (markdown + sentiment). `onSubmit({ body, sentiment })`
 * may return a promise; the form stays disabled until it settles.
 */
export function createOpinionEditor({ initialValue = '', sentiment, submitLabel = 'Post', onSubmit, onCancel }) {
  let editor = null;
  const textarea = createTextarea({
    value: initialValue,
    placeholder: 'Write your opinion in Markdown…',
    maxLength: maxOpinionLength,
    rows: 10,
  });
  const host = el('div', { className: 'opinions-editor__host' }, textarea);
  const picker = createSentimentPicker(sentiment);
  const submitButton = el('button', { type: 'submit', className: 'opinions-btn opinions-btn--primary' }, submitLabel);
  const cancelButton = el('button', { type: 'button', className: 'opinions-btn' }, 'Cancel');
  const form = el('form', { className: 'opinions-editor' },
    host,
    picker.element,
    el('div', { className: 'opinions-editor__actions' }, submitButton, cancelButton),
  );

  const getMarkdown = () => (editor ? editor.getMarkdown() : textarea.value);

  loadToastUi().then((Editor) => {
    if (!form.isConnected) {
      return;
    }
    const draft = textarea.value;
    const mount = el('div', { className: 'opinions-editor__toastui' });
    host.replaceChildren(mount);
    editor = new Editor({
      el: mount,
      height: '320px',
      initialEditType: 'markdown',
      previewStyle: 'tab',
      theme: isDarkTheme() ? 'dark' : 'light',
      initialValue: draft,
      usageStatistics: false,
      extendedAutolinks: true,
      // No image uploads: the toolbar has no image button and pasted or
      // dropped images are refused.
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol'],
        ['link'],
        ['code', 'codeblock'],
      ],
      hooks: {
        addImageBlobHook: () => {
          showToast('Images cannot be added to opinions.', 'warning');
        },
      },
    });
  }).catch((error) => {
    console.error('opinions: could not load the editor, keeping the plain textarea', error);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const body = getMarkdown().trim();
    if (!body) {
      showToast('Write something first.', 'warning');
      return;
    }
    if (body.length > maxOpinionLength) {
      showToast(`Opinions are limited to ${maxOpinionLength} characters.`, 'warning');
      return;
    }
    runSubmit(submitButton, () => onSubmit({ body, sentiment: picker.get() }));
  });
  cancelButton.addEventListener('click', () => onCancel?.());

  return {
    element: form,
    focus: () => (editor ? editor.focus() : textarea.focus()),
    destroy: () => {
      editor?.destroy();
      editor = null;
    },
  };
}

/** Plain textarea for replies. */
export function createReplyEditor({ onSubmit, onCancel }) {
  const textarea = createTextarea({
    value: '',
    placeholder: 'Write a reply…',
    maxLength: maxReplyLength,
    rows: 3,
  });
  const submitButton = el('button', { type: 'submit', className: 'opinions-btn opinions-btn--primary opinions-btn--small' }, 'Reply');
  const cancelButton = el('button', { type: 'button', className: 'opinions-btn opinions-btn--small' }, 'Cancel');
  const form = el('form', { className: 'opinions-reply-editor' },
    textarea,
    el('div', { className: 'opinions-editor__actions' }, submitButton, cancelButton),
  );
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const body = textarea.value.trim();
    if (!body) {
      showToast('Write something first.', 'warning');
      return;
    }
    runSubmit(submitButton, () => onSubmit({ body }));
  });
  cancelButton.addEventListener('click', () => onCancel?.());
  return { element: form, focus: () => textarea.focus() };
}
