// The legacy homepage has a long, minified hero markup line. Replace its
// obsolete iframe/SVG phone mockup at build time with a parser-discoverable image.
export function optimizeHomepageHtml(html, stylesheet) {
  if (!stylesheet || stylesheet.includes('</style')) {
    throw new Error('Expected a safe homepage stylesheet');
  }

  const stylesheetLink = '<link href="assets/css/home.min.css" rel="stylesheet" type="text/css"/>';
  if (!html.includes(stylesheetLink)) throw new Error('Expected the render-blocking homepage stylesheet');
  // Inline the base CSS so the first paint does not wait for another request.
  // Relative font URLs must still resolve from the homepage, not assets/css/.
  const inlineStylesheet = stylesheet.replaceAll('url(../fonts/', 'url(assets/fonts/');
  html = html.replace(stylesheetLink, `<style id="homepage-base-css">${inlineStylesheet}</style>`);

  const phoneStart = html.indexOf('<div class="home_hero-phone">');
  const phoneEnd = html.indexOf('<div class="hero_round-top">', phoneStart);
  if (phoneStart < 0 || phoneEnd < 0 || html.indexOf('<div class="home_hero-phone">', phoneStart + 1) !== -1) {
    throw new Error('Expected exactly one legacy homepage phone mockup');
  }

  const phone = `<div class="home_hero-phone"><picture class="hero-phone-replacement">
    <source srcset="assets/images/roz-expert-phone-mockup.avif" type="image/avif" />
    <img src="assets/images/roz-expert-phone-mockup.webp" width="891" height="1766" loading="eager" decoding="async" fetchpriority="high" alt="Roz Expert app portfolio conversation on an iPhone" class="home_hero-phone-img" />
  </picture></div>`;
  html = html.slice(0, phoneStart) + phone + html.slice(phoneEnd);

  const oldPreload = '<link rel="preload" as="image" href="assets/images/home-hero-approved.avif" type="image/avif" fetchpriority="high"/>';
  if (!html.includes(oldPreload)) throw new Error('Expected the legacy hero background preload');
  html = html.replace(oldPreload, '<link rel="preload" as="image" href="assets/images/roz-expert-phone-mockup.avif" type="image/avif" fetchpriority="high"/>');

  const oldBackground = '<img src="assets/images/home-hero-approved.avif" loading="eager" decoding="async" fetchpriority="high"';
  if (!html.includes(oldBackground)) throw new Error('Expected the legacy hero background image');
  html = html.replace(oldBackground, '<img src="assets/images/home-hero-approved.avif" loading="eager" decoding="async"');

  const oldScript = /<script>\s*\(function\(\) \{\s*var phone = document\.querySelector\('\.home_hero-phone'\);[\s\S]*?phone\.prepend\(image\);\s*\}\)\(\);\s*<\/script>/;
  if (!oldScript.test(html)) throw new Error('Expected the legacy phone insertion script');
  return html.replace(oldScript, '');
}
