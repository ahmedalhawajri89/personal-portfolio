// Second root layout, used only by the `/` redirect page beside it. The real
// site lives under app/[lang]/ and has its own root layout. English, because
// that is the language `/` now sends people to.
export default function RootRedirectLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
