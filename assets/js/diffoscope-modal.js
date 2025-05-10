const diffoscopeModal = document.getElementById('diffoscopeModal');
const diffoscopeModalContent = diffoscopeModal?.querySelector('.diffoscope-modal-content');
const diffoscopeCloseButton = document.querySelector('.diffoscope-close');
const diffoscopeMaximizeButton = document.querySelector('.diffoscope-maximize');
const diffoscopeIframe = document.getElementById('diffoscopeFrame');

let isMaximized = false;

window.openDiffoscopeModal = (link) => {
  diffoscopeIframe.src = link;
  diffoscopeModal.style.display = 'flex';
}

diffoscopeMaximizeButton.onclick = () => {
  isMaximized = !isMaximized;
  diffoscopeModalContent.classList.toggle('maximized');
  diffoscopeMaximizeButton.innerHTML = isMaximized ? '⧉' : '⛶';
  diffoscopeMaximizeButton.title = isMaximized ? 'Restore' : 'Maximize';
};

const resetModal = () => {
  diffoscopeModal.style.display = 'none';
  diffoscopeIframe.src = '';
  
  if (isMaximized) {
    isMaximized = false;
    diffoscopeModalContent.classList.remove('maximized');
    diffoscopeMaximizeButton.innerHTML = '⛶';
    diffoscopeMaximizeButton.title = 'Maximize';
  }
};

// Close modal
diffoscopeCloseButton.onclick = resetModal;

// Close modal on outside click
window.onclick = event => {
  if (event.target === diffoscopeModal) {
    resetModal();
  }
};