document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href*="#deadLink"], a[href*="&deadLink"]').forEach(function (a) {
    a.classList.add('dead-link');
    a.title = (a.title ? a.title + ' ' : '') + '(Dead link)';
    if (!a.textContent.includes('\uD83D\uDC80')) a.textContent += ' \uD83D\uDC80';
  });
  document.querySelectorAll('a[href*="web.archive.org/web/"]').forEach(function (a) {
    if (!a.classList.contains('dead-link')) {
      a.classList.add('archived-link');
      a.title = (a.title ? a.title + ' ' : '') + '(Archived)';
      if (!a.textContent.includes('\uD83D\uDCE6')) a.textContent += ' \uD83D\uDCE6';
    }
  });

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
