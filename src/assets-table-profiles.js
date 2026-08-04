export function ensureProfileStyles() {
  if (document.getElementById('assets-table-profile-styles')) {
    return;
  }
  const profileStyles = document.createElement('style');
  profileStyles.id = 'assets-table-profile-styles';
  profileStyles.textContent = `
    .profile-circle-container {
      position: relative;
      display: inline-block;
    }

    .profile-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
      margin-right: 5px;
    }

    .profile-hover-modal {
      display: none;
      position: absolute;
      z-index: 1000;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      padding: 15px;
      min-width: 200px;
      left: 50%;
      transform: translateX(-50%);
      top: 30px;
      text-align: center;
      color: #333;
      pointer-events: auto;
      cursor: default;
    }

    .profile-modal-content {
      pointer-events: none;
      cursor: default;
    }

    .profile-modal-content .profile-page-btn {
      pointer-events: auto;
      cursor: pointer;
    }

    .profile-modal-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 10px;
    }

    .profile-page-btn {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 8px 16px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }

    .profile-hover-modal:before {
      content: '';
      position: absolute;
      top: -10px;
      left: 0;
      width: 100%;
      height: 10px;
    }

    body.dark-theme .profile-hover-modal {
      background-color: #2d2d2d;
      color: white;
    }
  `;
  document.head.appendChild(profileStyles);
}

function attachProfileHoverHandlers(container) {
  const modal = container.querySelector('.profile-hover-modal');
  let timeout;

  container.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
    modal.style.display = 'block';
  });

  container.addEventListener('mouseleave', (e) => {
    const rect = modal.getBoundingClientRect();
    if (e.clientY >= rect.bottom || e.clientY <= rect.top ||
        e.clientX >= rect.right || e.clientX <= rect.left) {
      timeout = setTimeout(() => {
        if (!modal.matches(':hover')) {
          modal.style.display = 'none';
        }
      }, 300);
    }
  });

  modal.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
  });

  modal.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

export function renderProfilePictures(profilePubkeys) {
  ensureProfileStyles();
  const placeholderUrl = PROFILE_PLACEHOLDER_IMAGE;

  profilePubkeys.forEach(async pubkey => {
    const profileElementsForThisPubkey = document.querySelectorAll(`.profile-${pubkey}`);

    profileElementsForThisPubkey.forEach(profileElement => {
      profileElement.innerHTML = buildProfileCircleHtml(pubkey, null, placeholderUrl, placeholderUrl);
      wireProfileCircleInteractions(profileElement);
      const container = profileElement.querySelector('.profile-circle-container');
      if (container) {
        attachProfileHoverHandlers(container);
      }
    });

    try {
      const profile = await getNostrProfile(pubkey);
      const imageUrl = getProfileImageUrl(profile);

      profileElementsForThisPubkey.forEach(profileElement => {
        profileElement.innerHTML = buildProfileCircleHtml(pubkey, profile, imageUrl, placeholderUrl);
        wireProfileCircleInteractions(profileElement);
        const container = profileElement.querySelector('.profile-circle-container');
        if (container) {
          attachProfileHoverHandlers(container);
        }
      });
    } catch (error) {
      console.error(`Error loading profile for ${pubkey}:`, error);
    }
  });
}
