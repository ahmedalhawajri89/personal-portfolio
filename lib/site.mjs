// The site's public origin, used for canonical URLs, Open Graph, the sitemap
// and robots.txt. Resolved in this order:
//   1. NEXT_PUBLIC_SITE_URL      — set it when you attach a custom domain
//   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel provides this at build time
//   3. the fallback below
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : '';
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || fromVercel || 'https://ahmedalhawajri.vercel.app').replace(/\/$/, '');
