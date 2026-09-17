export const META_PIXEL_ID = '1733791577737514';

export const metaPixelHeadHtml = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->`;

export const metaPixelNoscriptHtml = `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>`;

export function injectMetaTracking(html) {
  if (html.includes(`fbq('init', '${META_PIXEL_ID}')`)) return html;
  return html
    .replace(/<\/head>/i, `${metaPixelHeadHtml}\n</head>`)
    .replace(/<body([^>]*)>/i, `$&\n${metaPixelNoscriptHtml}`);
}
