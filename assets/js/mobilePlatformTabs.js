window.updateDualMobileVerification = function (platform, info, elementId) {
  window._mobileVerParts = window._mobileVerParts || {};
  window._mobileVerParts[platform] = info;
  if (!('android' in window._mobileVerParts) || !('iphone' in window._mobileVerParts)) return;
  const el = document.getElementById(elementId);
  if (!el) return;
  const fmt = (ver, date) => ver ? '<b>' + ver + '</b> <small>(' + date + ')</small>' : '';
  const fmtDual = (aV, aD, iV, iD) => aV && iV
    ? '<i class="fab fa-google-play" aria-hidden="true"></i> ' + fmt(aV, aD) + ' / <i class="i-app-store" aria-hidden="true"></i> ' + fmt(iV, iD)
    : fmt(aV || iV, aD || iD);
  const a = window._mobileVerParts.android;
  const i = window._mobileVerParts.iphone;
  let html = '';
  const last = fmtDual(a.lastVersion, a.lastVersionDate, i.lastVersion, i.lastVersionDate);
  if (last) html += 'Latest release found in a <b>Verification</b>: ' + last + '<br>';
  const aR = a.lastVerifiedVersion !== a.lastVersion ? a.lastVerifiedVersion : null;
  const iR = i.lastVerifiedVersion !== i.lastVersion ? i.lastVerifiedVersion : null;
  const repro = fmtDual(aR, aR ? a.lastVerifiedVersionDate : null, iR, iR ? i.lastVerifiedVersionDate : null);
  if (repro) html += 'Last <span style="color: #008000;"><b>Reproducible Verification</b></span>: ' + repro;
  if (html) el.innerHTML = '<p>' + html + '</p>';
};

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
