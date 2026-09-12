// Second root layout, used only by the `/` redirect page below. The real
// site lives under app/[lang]/ and has its own root layout.
export default function RootRedirectLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
