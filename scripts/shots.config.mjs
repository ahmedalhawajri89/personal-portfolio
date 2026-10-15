// Every page of every project that gets photographed for the portfolio.
//
// A page is { key, path, ar, en, group, full?, mobile?, as?, prep? }:
//   key     file-name stem (unique within a project)
//   path    URL path on the project's dev server
//   ar/en   caption in each language
//   group   which part of the product this page belongs to (see GROUPS)
//   full    capture the full page (default: viewport only)
//   mobile  also capture at phone width
//   as      log in as this role first (see `roles`)
//   prep    async (page) => {} run after navigation, before the shot
//   animations  'allow' to photograph a page mid-animation (default: 'disabled')
//
// A project may also give init: ({ role }) => {} — an init script run in
// every page of each role's browser context, before the site's own scripts.
//
// Run:  node scripts/shots.mjs            (everything)
//       node scripts/shots.mjs diwan kafala
//
// Before running, the projects in D:\Works Exhibition\01-fullstack must be up:
//   MySQL      D:\xampp\mysql\bin\mysqld.exe --defaults-file=D:\xampp\mysql\bin\my.ini --standalone
//   kafala     cd kafala\api            && php artisan serve --port 8000
//   diwan      cd "diwan e-commerce"    && php artisan serve --port 8001
//   takharruj  cd takharruj             && php artisan serve --port 8002
//   mawaheb    cd mawaheb               && php artisan serve --port 8004
//   booking    cd waeda-booking         && npx vite --port 5173
// Playwright is loaded from booking\node_modules, so no install is needed here.

const PW = 'password';

export const PROJECTS = {
  /* ------------------------------------------------------------ diwan */
  diwan: {
    base: 'http://127.0.0.1:8001',
    locales: ['ar', 'en'],
    // The shop's pages live at /ar/… and /en/… ({l}); GET /locale/{l} sets the
    // session language that the bag, checkout and panel follow.
    setLocale: async (page, base, l) => { await page.goto(`${base}/locale/${l}`, { waitUntil: 'domcontentloaded' }); },
    // The local demo shop. The customer has a saved room (420 × 360) and a way
    // in (a lift, and a balcony for a hoist), so every verdict is answered.
    roles: {
      customer: { path: '/login', email: 'input[name=email]', password: 'input[name=password]', user: 'customer@fu.local', pass: 'customer1234' },
      admin: { path: '/login', email: 'input[name=email]', password: 'input[name=password]', user: 'admin@fu.local', pass: 'admin1234' },
    },
    groups: {
      shop: { ar: 'المتجر', en: 'Storefront' },
      account: { ar: 'حساب الزبون', en: 'Customer account' },
      admin: { ar: 'لوحة الإدارة', en: 'Admin dashboard' },
    },
    pages: [
      { key: 'home', path: '/{l}', ar: 'الصفحة الرئيسية', en: 'Home', group: 'shop', full: true, mobile: true },
      { key: 'catalogue', path: '/{l}/products', ar: 'المجموعة، بحكمٍ على غرفة الزبون', en: "Catalogue, judged against the customer's room", group: 'shop', as: 'customer', full: true, mobile: true },
      { key: 'category', path: '/{l}/category/living-room', ar: 'تصنيف: غرفة المعيشة', en: 'Category: living room', group: 'shop', full: true },
      { key: 'product', path: '/{l}/product/luxury-sofa', ar: 'صفحة المنتج: هل تتّسع لها الغرفة، وهل تصل إليها', en: 'Product page: does it fit the room, and does it get there', group: 'shop', as: 'customer', full: true, mobile: true },
      // The way in: door, lift or stairs, a villa's inner stairs, a balcony.
      { key: 'way-in', path: '/{l}/product/luxury-sofa', ar: 'طريق القطعة لبيتك', en: 'The way in', group: 'shop', as: 'customer', mobile: true,
        prep: async (page) => {
          await page.evaluate(() => document.getElementById('routeModal')?.showModal());
          await page.waitForTimeout(500);
        } },
      { key: 'lookbook', path: '/{l}/lookbook', ar: 'دفتر الإلهام', en: 'Lookbook', group: 'shop', full: true },
      { key: 'about', path: '/{l}/about', ar: 'من نحن', en: 'About', group: 'shop', full: true },
      { key: 'contact', path: '/{l}/contact', ar: 'تواصل', en: 'Contact', group: 'shop' },
      { key: 'login', path: '/login', ar: 'تسجيل الدخول', en: 'Sign in', group: 'shop', mobile: true },
      // Signed in as a customer: put one piece in the bag so the cart and
      // checkout are photographed with something in them.
      { key: 'cart', path: '/{l}/product/modern-sofa', ar: 'السلة', en: 'Cart', group: 'account', as: 'customer', mobile: true,
        // Only into an empty bag, so running the shots again does not pile up sofas.
        prep: async (page) => {
          const product = page.url();
          await page.goto(new URL('/cart', product).href, { waitUntil: 'networkidle' });
          if (await page.locator('a[href*="/product/"]').count()) return;
          await page.goto(product, { waitUntil: 'networkidle' });
          await page.click('form[action$="/cart/add"] button[type=submit]').catch(() => {});
          await page.waitForLoadState('networkidle').catch(() => {});
          await page.goto(new URL('/cart', product).href, { waitUntil: 'networkidle' });
        } },
      // The city sets the delivery fee; the day is booked from the shop's own delivery days.
      { key: 'checkout', path: '/checkout', ar: 'إتمام الطلب: المدينة ورسومها وموعد التوصيل', en: 'Checkout: city, fee and delivery day', group: 'account', as: 'customer', full: true, mobile: true,
        prep: async (page) => {
          const zone = page.locator('select[name=delivery_zone_id]');
          if (await zone.count()) await zone.selectOption({ index: 1 }).catch(() => {});
          await page.waitForTimeout(400);
        } },
      { key: 'orders', path: '/orders', ar: 'طلباتي', en: 'My orders', group: 'account', as: 'customer' },
      { key: 'order', path: '/orders/4', ar: 'طلب مُسلَّم، ومنه يُطلب الإرجاع', en: 'A delivered order, where a return is asked for', group: 'account', as: 'customer', full: true },
      { key: 'invoice', path: '/orders/4/invoice', ar: 'فاتورة ضريبية مبسّطة برمز ZATCA', en: 'Simplified tax invoice with its ZATCA QR', group: 'account', as: 'customer', full: true, mobile: true },
      { key: 'rooms', path: '/wishlist', ar: 'غرفي والمفضّلة', en: 'Rooms & wishlist', group: 'account', as: 'customer', full: true },
      { key: 'adm-dash', path: '/admin/dashboard', ar: 'نظرة عامة', en: 'Overview', group: 'admin', as: 'admin', full: true, mobile: true },
      { key: 'adm-products', path: '/admin/products', ar: 'المنتجات', en: 'Products', group: 'admin', as: 'admin', mobile: true },
      { key: 'adm-create', path: '/admin/products/create', ar: 'إضافة منتج: الأبعاد وطريقة الوصول', en: 'New product: dimensions and how it arrives', group: 'admin', as: 'admin', full: true },
      { key: 'adm-orders', path: '/admin/orders', ar: 'الطلبات', en: 'Orders', group: 'admin', as: 'admin' },
      { key: 'adm-order', path: '/admin/orders/4', ar: 'طلب: سجلّه وطريق القطعة لبيت الزبون', en: "An order: its history and the customer's way in", group: 'admin', as: 'admin', full: true },
      { key: 'adm-slip', path: '/admin/orders/4/slip', ar: 'ورقة التغليف', en: 'Packing slip', group: 'admin', as: 'admin', full: true },
      { key: 'adm-returns', path: '/admin/returns', ar: 'الإرجاع وأسبابه', en: 'Returns and their reasons', group: 'admin', as: 'admin' },
      { key: 'adm-zones', path: '/admin/delivery-zones', ar: 'مدن التوصيل ورسومها', en: 'Delivery cities and fees', group: 'admin', as: 'admin' },
      { key: 'adm-settings', path: '/admin/settings', ar: 'إعدادات المتجر', en: 'Shop settings', group: 'admin', as: 'admin', full: true },
      { key: 'adm-activity', path: '/admin/activity', ar: 'سجل النشاط', en: 'Activity log', group: 'admin', as: 'admin' },
      { key: 'adm-cats', path: '/admin/categories', ar: 'التصنيفات', en: 'Categories', group: 'admin', as: 'admin' },
      { key: 'adm-users', path: '/admin/users', ar: 'المستخدمون', en: 'Users', group: 'admin', as: 'admin' },
      { key: 'adm-reviews', path: '/admin/reviews', ar: 'الآراء', en: 'Reviews', group: 'admin', as: 'admin' },
    ],
  },

  /* ---------------------------------------------------------- booking */
  // Waeda on its demo backend (localStorage seed, re-dated to today), with the
  // clock pinned to 12:40 in the business's zone: the now-line sits mid-day
  // and the needs-attention queue is full whenever the shots are taken.
  booking: {
    base: 'http://127.0.0.1:5173',
    locales: ['ar'],
    timezoneId: 'Asia/Riyadh',
    fixedTime: '12:40',
    // The console's own dark theme, for one shot.
    init: ({ role }) => {
      if (role === 'dark') localStorage.setItem('bookingpro:theme', 'dark');
    },
    roles: {
      operator: { path: '/login', email: 'input[type=email]', password: 'input[type=password]', user: 'admin@waeda.app', pass: 'demo1234', waitFor: '**/app**' },
      dark: { path: '/login', email: 'input[type=email]', password: 'input[type=password]', user: 'admin@waeda.app', pass: 'demo1234', waitFor: '**/app**' },
    },
    groups: {
      public: { ar: 'جهة العميل', en: 'Customer side' },
      app: { ar: 'لوحة التحكم', en: 'Operator console' },
    },
    pages: [
      { key: 'home', path: '/', ar: 'الصفحة الرئيسية: القطاعات والحاسبة والباقات', en: 'Home: sectors, calculator and plans', group: 'public', full: true, mobile: true },
      // A service, a day and a time chosen, so the whole booking path shows.
      { key: 'book', path: '/b/alrayhan', ar: 'صفحة حجز المنشأة', en: 'A business booking page', group: 'public', full: true, mobile: true,
        prep: async (page) => {
          await page.getByText('تنظيف بشرة عميق').first().click();
          await page.waitForTimeout(300);
          await page.locator('[role=radio][data-numeric]:not([disabled])').nth(1).click();
          await page.waitForTimeout(400);
        } },
      // The day settles itself: reminders go out, replies come back, a
      // cancelled slot is refilled from the waitlist.
      { key: 'login', path: '/login', ar: 'الدخول: يومك يترتّب أمامك', en: 'Sign in: the day settles itself', group: 'public', animations: 'allow',
        prep: async (page) => { await page.waitForTimeout(7000); } },
      // The preview builds the page and takes its first booking.
      { key: 'register', path: '/register', ar: 'التسجيل: الصفحة تُبنى أمامك', en: 'Sign up: the page builds itself', group: 'public', animations: 'allow',
        prep: async (page) => { await page.waitForTimeout(9700); } },

      { key: 'board', path: '/app', ar: 'لوحة اليوم', en: 'Day board', group: 'app', as: 'operator', mobile: true },
      { key: 'guard', path: '/app/guard', ar: 'مساعد الحضور', en: 'The appointment guard', group: 'app', as: 'operator', full: true },
      { key: 'calendar', path: '/app/calendar?view=week', ar: 'التقويم', en: 'Calendar', group: 'app', as: 'operator' },
      { key: 'bookings', path: '/app/bookings', ar: 'الحجوزات', en: 'Bookings', group: 'app', as: 'operator', mobile: true },
      { key: 'customers', path: '/app/customers', ar: 'العملاء', en: 'Customers', group: 'app', as: 'operator' },
      // Chart.js times its draw-in against the clock, and the clock here is
      // pinned, so the lines would stay at zero. With reduced motion the app
      // draws them at once.
      { key: 'analytics', path: '/app/analytics?range=30', ar: 'التحليلات', en: 'Analytics', group: 'app', as: 'operator', full: true,
        prep: async (page) => {
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(600);
        } },
      // The booking link is shown with the live address, not the dev server's.
      { key: 'settings', path: '/app/settings', ar: 'الإعدادات', en: 'Settings', group: 'app', as: 'operator', full: true,
        prep: async (page) => {
          await page.evaluate(() => {
            const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            for (let n = w.nextNode(); n; n = w.nextNode()) {
              if (n.nodeValue.includes('127.0.0.1:5173')) n.nodeValue = n.nodeValue.replace('127.0.0.1:5173', 'waeda-booking.vercel.app');
            }
          });
        } },
      { key: 'board-dark', path: '/app', ar: 'لوحة اليوم بالوضع الليلي', en: 'Day board, dark theme', group: 'app', as: 'dark' },
    ],
  },

  /* ------------------------------------------------------- takharruj */
  // The Laravel app serves the public site too (the "project journey" home);
  // the old Next.js frontend is no longer what visitors see.
  grad: {
    base: 'http://127.0.0.1:8002',
    locales: ['ar', 'en'],
    // GET /locale/{l} sets the locale cookie for the site and the dashboards.
    setLocale: async (page, base, l) => { await page.goto(`${base}/locale/${l}`, { waitUntil: 'domcontentloaded' }); },
    // The welcome tour, the graduation dialog and the walking team are
    // one-time moments kept in localStorage. Mark them seen, so ordinary
    // pages are photographed at rest — except for the two roles that exist
    // to photograph those moments.
    init: ({ role }) => {
      const get = Storage.prototype.getItem;
      Storage.prototype.getItem = function (k) {
        if (typeof k === 'string') {
          if (k.startsWith('journey:')) return '99';
          if (k.startsWith('tour:') && role !== 'fresh') return '1';
          if (k.startsWith('celebrate:') && role !== 'graduate') return '1';
        }
        return get.call(this, k);
      };
      // Signing in already lands on the dashboard and plays the graduation
      // dialog once; the graduate never records it, so the shot sees it too.
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (role === 'graduate' && typeof k === 'string' && k.startsWith('celebrate:')) return;
        return set.call(this, k, v);
      };
    },
    roles: {
      admin: { path: '/login', email: '#identify', password: '#password', user: 'admin@admin.com', pass: 'adminadmin' },
      // A supervisor with a completed group, a scheduled defense and an active discussion.
      supervisor: { path: '/login', email: '#identify', password: '#password', user: 'heba.alshawa.205@supervisor.com', pass: 'adminadmin' },
      // A student mid-project: the rail has the team, the supervisor and the committee on it.
      student: { path: '/login', email: '#identify', password: '#password', user: 'reham.alkhateeb.238@student.com', pass: 'adminadmin' },
      // The same student on a first visit, for the welcome tour.
      fresh: { path: '/login', email: '#identify', password: '#password', user: 'reham.alkhateeb.238@student.com', pass: 'adminadmin' },
      // A graded student, for the graduation dialog.
      graduate: { path: '/login', email: '#identify', password: '#password', user: 'amer.alsaqqa.324@student.com', pass: 'adminadmin' },
    },
    groups: {
      site: { ar: 'الموقع التعريفي', en: 'Marketing site' },
      student: { ar: 'لوحة الطالب', en: 'Student dashboard' },
      supervisor: { ar: 'لوحة المشرف', en: 'Supervisor dashboard' },
      admin: { ar: 'لوحة الإدارة', en: 'Admin dashboard' },
      moments: { ar: 'لحظات التجربة', en: 'Moments' },
    },
    pages: [
      { key: 'home', path: '/', ar: 'رحلة المشروع — الصفحة الرئيسية', en: 'The project journey — home', group: 'site', full: true, mobile: true },
      // The team walks the path to the supervisor first; photograph it arrived.
      { key: 'login', path: '/login', ar: 'تسجيل الدخول', en: 'Sign in', group: 'site', mobile: true,
        prep: async (page) => { await page.waitForTimeout(4600); } },

      { key: 'stu-dash', path: '/student/dashboard', ar: 'مشروعي ومساره', en: 'My project and its path', group: 'student', as: 'student', full: true, mobile: true },
      { key: 'stu-discussion', path: '/student/discussion?tab=team', ar: 'نقاش الفريق', en: 'Team discussion', group: 'student', as: 'student', mobile: true },
      { key: 'stu-team', path: '/student/team', ar: 'الفريق والأدوار', en: 'Team and roles', group: 'student', as: 'student' },
      { key: 'stu-explore', path: '/student/projects/explore', ar: 'مشاريع منجزة', en: 'Past projects', group: 'student', as: 'student' },

      { key: 'sup-dash', path: '/supervisor/dashboard', ar: 'مجموعاتي', en: 'My groups', group: 'supervisor', as: 'supervisor', full: true, mobile: true },
      { key: 'sup-project', path: '/supervisor/projects/10', ar: 'إدارة مشروع', en: 'Project management', group: 'supervisor', as: 'supervisor', full: true },
      { key: 'sup-plan', path: '/supervisor/plan', ar: 'خطة المراحل', en: 'Stage plan', group: 'supervisor', as: 'supervisor', full: true },
      { key: 'sup-discussion', path: '/supervisor/discussion/10', ar: 'النقاش الحيّ', en: 'Live discussion', group: 'supervisor', as: 'supervisor' },
      { key: 'sup-defenses', path: '/supervisor/defenses', ar: 'مناقشاتي', en: 'My defenses', group: 'supervisor', as: 'supervisor' },
      { key: 'sup-requests', path: '/supervisor/dashboard/projects/request', ar: 'طلبات الإشراف', en: 'Supervision requests', group: 'supervisor', as: 'supervisor' },
      { key: 'sup-archive', path: '/supervisor/projects/archive', ar: 'الأرشيف', en: 'Archive', group: 'supervisor', as: 'supervisor' },

      { key: 'dash', path: '/admin/dashboard', ar: 'نظرة عامة', en: 'Overview', group: 'admin', as: 'admin', full: true, mobile: true },
      { key: 'defenses', path: '/admin/defenses?week=2026-10-11', ar: 'مخطِّط المناقشات واللجان', en: 'Defense planner and committees', group: 'admin', as: 'admin', full: true },
      { key: 'students', path: '/admin/students', ar: 'الطلبة', en: 'Students', group: 'admin', as: 'admin', mobile: true },
      { key: 'groups', path: '/admin/groups/index', ar: 'المجموعات', en: 'Groups', group: 'admin', as: 'admin' },
      { key: 'group', path: '/admin/groups/33/show', ar: 'تفاصيل مجموعة', en: 'Group detail', group: 'admin', as: 'admin', full: true },
      { key: 'audit', path: '/admin/audit', ar: 'سجلّ التدقيق', en: 'Audit log', group: 'admin', as: 'admin' },
      { key: 'semesters', path: '/admin/semesters', ar: 'الفصول الدراسية', en: 'Semesters', group: 'admin', as: 'admin' },
      { key: 'specialize', path: '/admin/specialize', ar: 'التخصصات', en: 'Specialisations', group: 'admin', as: 'admin' },

      // One-time moments, caught mid-flight.
      { key: 'stu-grade', path: '/student/dashboard', ar: 'لحظة التخرّج', en: 'The graduation moment', group: 'moments', as: 'graduate', animations: 'allow', mobile: true,
        prep: async (page) => { await page.waitForSelector('dialog.celebrate[open]', { timeout: 8000 }); await page.waitForTimeout(400); } },
      { key: 'stu-tour', path: '/student/dashboard', ar: 'الجولة التعريفية', en: 'The welcome tour', group: 'moments', as: 'fresh',
        prep: async (page) => {
          await page.waitForSelector('.tour:not([hidden]) .tour-next', { timeout: 8000 });
          await page.waitForTimeout(500);
          await page.click('.tour-next');
          await page.waitForTimeout(700);
        } },
      { key: 'confirm', path: '/supervisor/discussion/10', ar: 'نافذة التأكيد', en: 'Confirmation dialog', group: 'moments', as: 'supervisor',
        prep: async (page) => {
          await page.evaluate(() => { const f = document.querySelector('.msg-del'); if (f) f.requestSubmit(f.querySelector('button')); });
          await page.waitForSelector('dialog.app-dialog[open]', { timeout: 8000 });
          await page.waitForTimeout(500);
        } },
    ],
  },

  /* ----------------------------------------------------------- kafala */
  kafala: {
    base: 'http://127.0.0.1:8000',
    locales: ['ar'],
    roles: {
      // The public site logs in through the API and redirects to the portal.
      sponsor: { path: '/login', email: '#email', password: '#password', user: 'sponsor@kafala.org', pass: PW, waitFor: '**/dashboard**' },
      admin: { path: '/admin/login', email: '#email', password: '#password', user: 'admin@kafala.org', pass: PW, waitFor: '**/admin/dashboard**' },
    },
    groups: {
      public: { ar: 'الموقع العام', en: 'Public site' },
      portal: { ar: 'بوابة الكافل', en: 'Sponsor portal' },
      admin: { ar: 'لوحة الإدارة', en: 'Admin dashboard' },
    },
    pages: [
      { key: 'home', path: '/', ar: 'الصفحة الرئيسية', en: 'Home', group: 'public', full: true, mobile: true },
      { key: 'orphans', path: '/orphans', ar: 'الأيتام', en: 'Orphans', group: 'public', full: true, mobile: true },
      { key: 'orphan', path: '/orphan?id=1', ar: 'ملف يتيم', en: 'Orphan profile', group: 'public', full: true, mobile: true },
      { key: 'programs', path: '/programs', ar: 'البرامج', en: 'Programs', group: 'public', full: true },
      { key: 'transparency', path: '/transparency', ar: 'الشفافية', en: 'Transparency', group: 'public', full: true, mobile: true },
      { key: 'about', path: '/about', ar: 'عن كفالة', en: 'About', group: 'public', full: true },
      { key: 'blog', path: '/blog', ar: 'المدوّنة', en: 'Blog', group: 'public', full: true },
      { key: 'post', path: '/post?slug=قصة-مريم', ar: 'مقال', en: 'Article', group: 'public', full: true },
      { key: 'faq', path: '/faq', ar: 'الأسئلة الشائعة', en: 'FAQ', group: 'public' },
      { key: 'contact', path: '/contact', ar: 'تواصل', en: 'Contact', group: 'public' },
      { key: 'checkout', path: '/checkout?id=1', ar: 'بدء كفالة', en: 'Start a sponsorship', group: 'public', full: true, mobile: true },
      { key: 'login', path: '/login', ar: 'تسجيل الدخول', en: 'Sign in', group: 'public' },
      { key: 'register', path: '/register', ar: 'إنشاء حساب', en: 'Register', group: 'public' },
      { key: 'notfound', path: '/this-page-does-not-exist', ar: 'صفحة ٤٠٤', en: '404 page', group: 'public' },
      { key: 'portal', path: '/dashboard', ar: 'بوابة الكافل', en: 'Sponsor portal', group: 'portal', as: 'sponsor', full: true, mobile: true },
      { key: 'adm-login', path: '/admin/login', ar: 'دخول الإدارة', en: 'Admin sign in', group: 'admin' },
      { key: 'adm-dash', path: '/admin/dashboard', ar: 'نظرة عامة', en: 'Overview', group: 'admin', as: 'admin', full: true, mobile: true },
      { key: 'adm-orphans', path: '/admin/orphans', ar: 'الأيتام', en: 'Orphans', group: 'admin', as: 'admin', mobile: true },
      { key: 'adm-orphan', path: '/admin/orphans/1', ar: 'ملف يتيم', en: 'Orphan file', group: 'admin', as: 'admin', full: true },
      { key: 'adm-families', path: '/admin/families', ar: 'الأسر', en: 'Families', group: 'admin', as: 'admin' },
      { key: 'adm-sponsors', path: '/admin/sponsors', ar: 'الكفلاء', en: 'Sponsors', group: 'admin', as: 'admin' },
      { key: 'adm-sponsorships', path: '/admin/sponsorships', ar: 'الكفالات', en: 'Sponsorships', group: 'admin', as: 'admin' },
      { key: 'adm-payments', path: '/admin/payments', ar: 'المدفوعات', en: 'Payments', group: 'admin', as: 'admin' },
      { key: 'adm-disburse', path: '/admin/disbursements', ar: 'الصرف', en: 'Disbursements', group: 'admin', as: 'admin' },
      { key: 'adm-reports', path: '/admin/reports', ar: 'التقارير', en: 'Reports', group: 'admin', as: 'admin' },
      { key: 'adm-visits', path: '/admin/visits', ar: 'الزيارات الميدانية', en: 'Field visits', group: 'admin', as: 'admin' },
      { key: 'adm-messages', path: '/admin/messages', ar: 'الرسائل', en: 'Messages', group: 'admin', as: 'admin' },
      { key: 'adm-contacts', path: '/admin/contacts', ar: 'رسائل التواصل', en: 'Contact messages', group: 'admin', as: 'admin' },
      { key: 'adm-users', path: '/admin/users', ar: 'المستخدمون', en: 'Users', group: 'admin', as: 'admin' },
      { key: 'adm-content', path: '/admin/content', ar: 'محتوى الموقع', en: 'Site content', group: 'admin', as: 'admin' },
      { key: 'adm-settings', path: '/admin/settings', ar: 'الإعدادات', en: 'Settings', group: 'admin', as: 'admin' },
      { key: 'adm-activity', path: '/admin/activity', ar: 'سجل النشاط', en: 'Activity log', group: 'admin', as: 'admin' },
    ],
  },

  /* ---------------------------------------------------------- mawaheb */
  mawaheb: {
    base: 'http://127.0.0.1:8004',
    locales: ['ar', 'en'],
    // POST /locale with the CSRF token from the page.
    setLocale: async (page, base, l) => {
      await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(async (l) => {
        const t = document.querySelector('meta[name=csrf-token]')?.content || '';
        await fetch('/locale', { method: 'POST', headers: { 'X-CSRF-TOKEN': t, 'Content-Type': 'application/x-www-form-urlencoded' }, body: `locale=${l}`, credentials: 'same-origin' });
      }, l);
    },
    roles: {
      talent: { path: '/login', email: '#email', password: '#password', user: 'layan-alharbi@demo.mawaheb.test', pass: PW },
      scout: { path: '/login', email: '#email', password: '#password', user: 'scout@demo.mawaheb.test', pass: PW },
    },
    groups: {
      public: { ar: 'الاكتشاف', en: 'Discovery' },
      talent: { ar: 'لوحة الموهبة', en: 'Talent dashboard' },
      scout: { ar: 'لوحة الكشّاف', en: 'Scout dashboard' },
    },
    pages: [
      { key: 'home', path: '/', ar: 'الصفحة الرئيسية', en: 'Home', group: 'public', full: true, mobile: true },
      { key: 'discover', path: '/discover', ar: 'اكتشف المواهب', en: 'Discover', group: 'public', full: true, mobile: true },
      { key: 'search', path: '/search?q=design', ar: 'البحث', en: 'Search', group: 'public' },
      { key: 'profile', path: '/t/abdulrahman-salem', ar: 'ملف موهبة', en: 'Talent profile', group: 'public', full: true, mobile: true },
      { key: 'opps', path: '/opportunities', ar: 'الفرص', en: 'Opportunities', group: 'public', full: true },
      { key: 'opp', path: '/opportunities/crafts-commission-8', ar: 'تفاصيل فرصة', en: 'Opportunity', group: 'public', full: true },
      { key: 'pricing', path: '/pricing', ar: 'الباقات', en: 'Pricing', group: 'public', full: true },
      { key: 'how', path: '/how-it-works', ar: 'كيف يعمل', en: 'How it works', group: 'public', full: true },
      { key: 'about', path: '/about', ar: 'عن مواهب', en: 'About', group: 'public', full: true },
      { key: 'contact', path: '/contact', ar: 'تواصل', en: 'Contact', group: 'public' },
      { key: 'login', path: '/login', ar: 'تسجيل الدخول', en: 'Sign in', group: 'public', mobile: true },
      { key: 'register', path: '/register', ar: 'إنشاء حساب', en: 'Register', group: 'public' },
      { key: 'dash', path: '/dashboard', ar: 'لوحة الموهبة', en: 'Dashboard', group: 'talent', as: 'talent', full: true, mobile: true },
      { key: 'portfolio', path: '/dashboard/portfolio', ar: 'أعمالي', en: 'Portfolio', group: 'talent', as: 'talent', full: true },
      { key: 'applications', path: '/dashboard/applications', ar: 'طلباتي', en: 'Applications', group: 'talent', as: 'talent' },
      { key: 'analytics', path: '/dashboard/analytics', ar: 'الإحصاءات', en: 'Analytics', group: 'talent', as: 'talent', full: true },
      { key: 'notifications', path: '/notifications', ar: 'الإشعارات', en: 'Notifications', group: 'talent', as: 'talent' },
      { key: 'settings', path: '/settings', ar: 'الإعدادات', en: 'Settings', group: 'talent', as: 'talent', full: true },
      { key: 'scout-opps', path: '/dashboard/opportunities', ar: 'فرصي', en: 'My opportunities', group: 'scout', as: 'scout' },
      { key: 'scout-new', path: '/opportunities/create', ar: 'نشر فرصة', en: 'Post an opportunity', group: 'scout', as: 'scout', full: true },
    ],
  },
};
