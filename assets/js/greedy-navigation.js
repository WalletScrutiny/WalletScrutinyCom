/* ==========================================================================
   Greedy navigation (vanilla port)
   http://codepen.io/lukejacksonn/pen/PwmwWV
   ========================================================================== */

function elementWidth(element) {
  const style = getComputedStyle(element);
  const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
  return element.getBoundingClientRect().width - padding - border;
}

export function initGreedyNavigation() {
  const nav = document.getElementById('site-nav');
  if (!nav) {
    return;
  }

  const btn = nav.querySelector('button');
  const vlinks = nav.querySelector('.visible-links');
  const hlinks = nav.querySelector('.hidden-links');
  if (!btn || !vlinks || !hlinks) {
    return;
  }

  const breaks = [];

  function updateNav() {
    const availableSpace = btn.classList.contains('hidden')
      ? elementWidth(nav)
      : elementWidth(nav) - elementWidth(btn) - 30;

    if (elementWidth(vlinks) > availableSpace) {
      breaks.push(elementWidth(vlinks));
      const lastChild = vlinks.lastElementChild;
      if (lastChild) {
        hlinks.insertBefore(lastChild, hlinks.firstElementChild);
      }
      btn.classList.remove('hidden');
    } else {
      if (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
        const firstHidden = hlinks.firstElementChild;
        if (firstHidden) {
          vlinks.appendChild(firstHidden);
        }
        breaks.pop();
      }

      if (breaks.length < 1) {
        btn.classList.add('hidden');
        hlinks.classList.add('hidden');
      }
    }

    btn.setAttribute('count', String(breaks.length));

    if (elementWidth(vlinks) > availableSpace) {
      updateNav();
    }
  }

  let resizeScheduled = false;
  window.addEventListener('resize', () => {
    if (resizeScheduled) {
      return;
    }
    resizeScheduled = true;
    requestAnimationFrame(() => {
      resizeScheduled = false;
      updateNav();
    });
  });

  btn.addEventListener('click', () => {
    hlinks.classList.toggle('hidden');
    btn.classList.toggle('close');
  });

  updateNav();
}
