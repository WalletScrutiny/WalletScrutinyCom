export function formatDate(timestamp, short = false) {
  return new Date(timestamp * 1000).toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(short ? {} : { hour: '2-digit', minute: '2-digit' })
  });
}
