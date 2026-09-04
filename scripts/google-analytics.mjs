export const GOOGLE_ANALYTICS_ID = 'G-WTNM9SPHNY';

export const GOOGLE_ANALYTICS_TAG = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${GOOGLE_ANALYTICS_ID}');
  </script>`;

export function injectGoogleAnalytics(html) {
  const loader = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  if (html.includes(loader)) return html;
  if (!html.includes('<head>')) {
    throw new Error('Cannot inject Google Analytics: document is missing a <head> element.');
  }
  return html.replace('<head>', `<head>\n${GOOGLE_ANALYTICS_TAG}`);
}
