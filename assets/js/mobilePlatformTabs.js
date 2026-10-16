document.addEventListener('DOMContentLoaded', function () {
  function isByAuthorBlock(node) {
    return node && node.tagName === 'P' && node.textContent.includes('Product page updated by');
  }

  function initMobilePlatformContentPanels() {
    const content = document.querySelector('.app-review .page__content');
    if (!content) return false;

    const androidHeading = content.querySelector('h2#android');
    const iphoneHeading = content.querySelector('h2#iphone');
    if (!androidHeading || !iphoneHeading) return false;

    const wrapper = document.createElement('div');
    wrapper.className = 'mobile-content-panels';

    // Whatever the review says before "## Android" applies to both apps, so it
    // goes above the platform text and stays visible on either tab.
    const commonPart = document.createElement('div');
    commonPart.className = 'mobile-content-common';
    while (content.firstElementChild && content.firstElementChild !== androidHeading) {
      commonPart.appendChild(content.firstElementChild);
    }
    if (commonPart.firstElementChild) wrapper.appendChild(commonPart);

    const androidPanel = document.createElement('div');
    androidPanel.className = 'mobile-content-panel is-active';
    androidPanel.id = 'mobile-content-android';
    androidPanel.setAttribute('data-mobile-content-panel', 'android');

    const iphonePanel = document.createElement('div');
    iphonePanel.className = 'mobile-content-panel';
    iphonePanel.id = 'mobile-content-iphone';
    iphonePanel.setAttribute('data-mobile-content-panel', 'iphone');
    iphonePanel.setAttribute('hidden', '');

    let node = androidHeading.nextElementSibling;
    while (node && node !== iphoneHeading) {
      const next = node.nextElementSibling;
      androidPanel.appendChild(node);
      node = next;
    }

    node = iphoneHeading.nextElementSibling;
    while (node && !isByAuthorBlock(node)) {
      const next = node.nextElementSibling;
      iphonePanel.appendChild(node);
      node = next;
    }

    // Reviews separate the Android and iPhone text with a "---" rule. In tabs
    // nothing follows it, so it would only leave a line and a gap under the
    // features.
    [commonPart, androidPanel, iphonePanel].forEach(function (part) {
      while (part.lastElementChild && part.lastElementChild.tagName === 'HR') {
        part.lastElementChild.remove();
      }
    });

    wrapper.appendChild(androidPanel);
    wrapper.appendChild(iphonePanel);
    androidHeading.replaceWith(wrapper);
    iphoneHeading.remove();

    return true;
  }

  function wrapMobilePlatformScopeBody() {
    const scope = document.querySelector('[data-mobile-platform-scope]');
    const contentPanels = document.querySelector('.mobile-content-panels');
    if (!scope || !contentPanels) return;

    const body = scope.querySelector('.mobile-platform-scope__body');
    if (body && !body.contains(contentPanels)) {
      body.appendChild(contentPanels);
    }
  }

  // The review text follows the review steps, so its headings ("App
  // Description", "Analysis", ...) get the same icon tile and title size as a step.
  function sectionIconName(title) {
    const t = title.toLowerCase();
    if (t.includes('description')) return 'book-open';
    if (t.includes('verdict') || t.includes('conclusion')) return 'clipboard-check';
    if (t.includes('analysis') || t.includes('testing')) return 'magnifying-glass';
    if (t.includes('update')) return 'clock-rotate-left';
    return 'circle-info';
  }

  function addSectionIcons() {
    const content = document.querySelector('.app-review .page__content[data-icon-sprite]');
    if (!content) return;
    const sprite = content.getAttribute('data-icon-sprite');
    const headings = Array.from(content.querySelectorAll(':scope > h2')).concat(
      Array.from(document.querySelectorAll('.mobile-content-common > h2, .mobile-content-panel > h2')));
    headings.forEach(function (heading) {
      const row = document.createElement('div');
      row.className = 'review-section-title';
      const tile = document.createElement('i');
      tile.className = 'circle';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const name = sectionIconName(heading.textContent);
      svg.setAttribute('class', 'ws-icon ws-icon-' + name);
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', sprite + '#' + name);
      svg.appendChild(use);
      tile.appendChild(svg);
      heading.replaceWith(row);
      row.appendChild(tile);
      row.appendChild(heading);
    });
  }

  function showMobilePlatform(platform) {
    document.querySelectorAll('[data-mobile-panel]').forEach(function (panel) {
      const show = panel.getAttribute('data-mobile-panel') === platform;
      panel.classList.toggle('is-active', show);
      if (show) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    document.querySelectorAll('[data-mobile-content-panel]').forEach(function (panel) {
      const show = panel.getAttribute('data-mobile-content-panel') === platform;
      panel.classList.toggle('is-active', show);
      if (show) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    const scope = document.querySelector('[data-mobile-platform-scope]');
    if (scope) {
      scope.setAttribute('data-active-platform', platform);
    }
  }

  const hasMobileContentPanels = initMobilePlatformContentPanels();
  wrapMobilePlatformScopeBody();
  addSectionIcons();

  document.querySelectorAll('[data-mobile-platform-scope]').forEach(function (scope) {
    const tabs = scope.querySelectorAll('[data-mobile-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        showMobilePlatform(tab.getAttribute('data-mobile-tab'));
        tabs.forEach(function (t) {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      });
    });
  });

  if (hasMobileContentPanels) {
    showMobilePlatform('android');
  }
});
