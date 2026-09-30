/* ==========================================================================
   Responsive video embeds (vanilla port of FitVids)
   ========================================================================== */

const FIT_VIDS_STYLE_ID = 'fit-vids-style';
const FIT_VIDS_SELECTORS = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]',
  'object',
  'embed',
];

function ensureFitVidsStyles() {
  if (document.getElementById(FIT_VIDS_STYLE_ID)) {
    return;
  }
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.id = FIT_VIDS_STYLE_ID;
  style.textContent = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed{position:absolute;top:0;left:0;width:100%;height:100%;}';
  head.appendChild(style);
}

function elementWidth(element) {
  return element.getBoundingClientRect().width;
}

function elementHeight(element) {
  return element.getBoundingClientRect().height;
}

function wrapVideo(video, count) {
  if (video.closest('.fitvidsignore')) {
    return;
  }
  if (
    (video.tagName.toLowerCase() === 'embed' && video.parentElement?.tagName.toLowerCase() === 'object')
    || video.parentElement?.classList.contains('fluid-width-video-wrapper')
  ) {
    return;
  }

  const heightAttr = video.getAttribute('height');
  const widthAttr = video.getAttribute('width');
  if (
    !video.style.height && !video.style.width
    && (Number.isNaN(Number(heightAttr)) || Number.isNaN(Number(widthAttr)))
  ) {
    video.setAttribute('height', '9');
    video.setAttribute('width', '16');
  }

  const height = video.tagName.toLowerCase() === 'object' || (heightAttr && !Number.isNaN(parseInt(heightAttr, 10)))
    ? parseInt(heightAttr, 10)
    : elementHeight(video);
  const width = widthAttr && !Number.isNaN(parseInt(widthAttr, 10))
    ? parseInt(widthAttr, 10)
    : elementWidth(video);
  const aspectRatio = height / width;

  if (!video.id) {
    video.id = `fitvid${count}`;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'fluid-width-video-wrapper';
  wrapper.style.paddingTop = `${aspectRatio * 100}%`;
  video.parentNode.insertBefore(wrapper, video);
  wrapper.appendChild(video);
  video.removeAttribute('height');
  video.removeAttribute('width');
}

export function fitVids(root) {
  if (!root) {
    return;
  }

  ensureFitVidsStyles();

  const videos = root.querySelectorAll(FIT_VIDS_SELECTORS.join(','));
  let count = 0;
  for (const video of videos) {
    if (video.tagName.toLowerCase() === 'object' && video.querySelector('object')) {
      continue;
    }
    wrapVideo(video, count);
    count += 1;
  }
}
