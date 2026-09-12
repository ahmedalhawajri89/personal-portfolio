// In production, scripts/postbuild.mjs copies out/ar/* over the site root, so
// this page is overwritten by the Arabic home page. It only matters in `next dev`,
// where `/` would otherwise be a 404.
export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/ar/" />
      <p style={{ fontFamily: 'sans-serif', padding: 24 }}>
        <a href="/ar/">العربية</a> · <a href="/en/">English</a>
      </p>
    </>
  );
}
