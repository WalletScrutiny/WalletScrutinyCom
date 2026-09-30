// Masthead behaviour shared by every page: theme toggle, notifications
// panel and the greedy-nav burger. Loaded synchronously right after the
// masthead markup, so the DOM it touches already exists and the onclick
// handlers in _includes/masthead.html find their globals.
document.body.classList.add(window.theme);
function toggleTheme(){
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
