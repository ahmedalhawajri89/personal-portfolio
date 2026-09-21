// What `/` serves.
//
// The old comment here said this page is overwritten in production by
// scripts/postbuild.mjs copying out/ar/* over the root. That is true for
// `npm start`, which serves out/ directly, and false on Vercel: its Next
// builder collects its own output and never sees files written into out/
// afterwards. The live root was this stub -- 6KB and a meta refresh -- so
// every visitor arriving at the bare domain paid an extra navigation before
// the site began loading.
//
// It now points at /en/, the default language. The links stay: a refresh
// meta tag is the only redirect a static export can express, and if it is
// ignored or disabled the visitor still has somewhere to click rather than
// a blank page.
export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/en/" />
      <title>Ahmed Al-Hawajiri — Full-Stack Web Developer</title>
      {/* Not indexable: the real pages are /en/ and /ar/, each canonical to
          itself, and this one holds no content worth ranking. */}
      <meta name="robots" content="noindex" />
      <link rel="canonical" href="https://ahmedalhawajri.vercel.app/en/" />
      <p style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <a href="/en/">English</a> · <a href="/ar/">العربية</a>
      </p>
    </>
  );
}
