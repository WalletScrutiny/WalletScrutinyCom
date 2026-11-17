// Masthead behaviour shared by every page: theme toggle, notifications
// panel and the greedy-nav burger. Loaded synchronously right after the
// masthead markup, so the DOM it touches already exists and the onclick
// handlers in _includes/masthead.html find their globals.
document.body.classList.add(window.theme);
function toggleTheme(trigger){
  if(window.theme !== "dark"){
    window.theme = "dark";
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  } else {
    window.theme = "light";
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
  try { localStorage.setItem('colour-scheme', window.theme) } catch (e) {}
  // on narrow screens the toggle sits in the burger dropdown; close it
  if (trigger && trigger.closest('.hidden-links')) {
    const menuToggle = document.querySelector('.greedy-nav__toggle.close');
    if (menuToggle) menuToggle.click();
  }
}

function addNotificationToIndicator(title, details, type = 'info'){
  const notificationsList = document.querySelector('.notifications-list');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <div class="title-row">
        ${wsIcon(type === 'info' ? 'circle-info' : type === 'warning' ? 'triangle-exclamation' : 'circle-check')}
        <span style="margin-left: 9px;">${title}</span>
      </div>
      <div class="details-row">
        <span>${details}</span>
      </div>
    </div>
  `;
  notificationsList.appendChild(notification);
  
  document.querySelector(".notifications-indicator").style.display = "block";
}

function showNotifications(){
  const indicator = document.querySelector(".notifications-indicator");
  const panel = document.getElementById('notificationsPanel');
  const rect = indicator.getBoundingClientRect();

  // Ensure panel is measurable by making it temporarily visible but off-screen
  panel.style.visibility = 'hidden';
  panel.style.display = 'block';
  const panelWidth = panel.offsetWidth;
  panel.style.display = 'none'; // Hide it again before final positioning
  panel.style.visibility = 'visible';

  // Position panel below the indicator
  panel.style.top = `${rect.bottom + window.scrollY}px`;

  // Align panel's right edge with indicator's left edge
  panel.style.left = `${rect.left + window.scrollX - panelWidth}px`; 

  // Make the panel visible at the calculated position
  panel.style.display = 'block';
}
function hideNotifications(){
  document.getElementById('notificationsPanel').style.display = "none";
}

// Close notifications panel when clicking outside
document.addEventListener('click', (event) => {
  const notificationsPanel = document.getElementById('notificationsPanel');
  const notificationsIndicator = document.querySelector(".notifications-indicator");
  if (!notificationsPanel.contains(event.target) && 
      !notificationsIndicator.contains(event.target) && 
      notificationsPanel.style.display === "block") {
    hideNotifications();
  }
});

document.querySelector(".navicon").parentNode.addEventListener("click", (event) => {
  const self = document.querySelector(".navicon").parentNode;
  const right = (window.outerWidth - self.getBoundingClientRect().right)-(self.clientWidth/2);
  document.querySelector(".hidden-links").style.right=`calc(${right}px + 1.5rem)`;
});

/* ==========================================================================
   Greedy navigation (vanilla port)
   http://codepen.io/lukejacksonn/pen/PwmwWV
   Runs here rather than in the main bundle so links that do not fit are in
   the burger from the first paint, not spilled over the logo until the
   bundle loads.
   ========================================================================== */

function elementWidth(element) {
  const style = getComputedStyle(element);
  const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
  return element.getBoundingClientRect().width - padding - border;
}

function initGreedyNavigation() {
  const nav = document.getElementById('site-nav');
  if (!nav) {
    return;
  }

  const btn = nav.querySelector('.greedy-nav__toggle');
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
  // links widen when the web font arrives, which fires no resize
  if (document.fonts) {
    document.fonts.ready.then(updateNav);
  }
}

initGreedyNavigation();
