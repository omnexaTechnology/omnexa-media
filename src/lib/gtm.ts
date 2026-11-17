/* Google Tag Manager container for media.omnexa.sa. NEXT_PUBLIC_* is inlined at build time; when the host's build env
   does not set it, fall back to the site's container so production never ships without tracking (a container ID is
   public, not a secret). The container holds the GA4 Google tag for property 564394064 (G-W3XN5NQR7S). */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-KSHRL7JL";

/* Google's standard GTM snippet, rendered in <head> so the tag is in the page source (GTM's "Test your website" check
   reads the HTML and does not see scripts added after hydration). It only runs on the production host: local dev,
   `next start` test runs and previews send nothing. */
export function gtmHeadJs(host: string) {
  return `(function(w,d,s,l,i){if(location.hostname!==${JSON.stringify(host)})return;w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`;
}
