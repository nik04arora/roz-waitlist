export const CLARITY_PROJECT_ID = 'yjyc63fm6r';

export const clarityHeadHtml = `<!-- Microsoft Clarity -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
</script>
<!-- End Microsoft Clarity -->`;

export function injectClarity(html) {
  if (html.includes(`"${CLARITY_PROJECT_ID}"`)) return html;
  if (!/<\/head>/i.test(html)) {
    throw new Error('Cannot inject Clarity: document is missing a </head> element.');
  }
  return html.replace(/<\/head>/i, `${clarityHeadHtml}\n</head>`);
}
