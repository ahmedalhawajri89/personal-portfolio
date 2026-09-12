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
//
// Run:  node scripts/shots.mjs            (everything)
//       node scripts/shots.mjs diwan kafala
//
// Before running, the projects in D:\Works Exhibition\01-fullstack must be up:
//   MySQL      D:\xampp\mysql\bin\mysqld.exe --defaults-file=D:\xampp\mysql\bin\my.ini --standalone
//   kafala     cd kafala\api            && php artisan serve --port 8000
//   diwan      cd "diwan e-commerce"    && php artisan serve --port 8001
//   takharruj  cd graduationProjectTraker          && php artisan serve --port 8002
//              cd graduationProjectTraker\frontend && npx next dev -p 3006
//   mawaheb    cd mawaheb               && php artisan serve --port 8004
//   booking    cd booking               && npx vite --port 5173
// Playwright is loaded from booking\node_modules, so no install is needed here.

const PW = 'password';

export const PROJECTS = {
  /* ------------------------------------------------------------ diwan */
  diwan: {
    base: 'http://127.0.0.1:8001',
    locales: ['ar', 'en'],
    // GET /locale/{l} switches the session language.
    setLocale: async (page, base, l) => { await page.goto(`${base}/locale/${l}`, { waitUntil: 'domcontentloaded' }); },
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
      { key: 'home', path: '/', ar: 'الصفحة الرئيسية', en: 'Home', group: 'shop', full: true, mobile: true },
      { key: 'catalogue', path: '/products', ar: 'المجموعة', en: 'Catalogue', group: 'shop', full: true, mobile: true },
      { key: 'category', path: '/category/living-room', ar: 'تصنيف: غرفة المعيشة', en: 'Category: living room', group: 'shop', full: true },
      { key: 'product', path: '/product/classic-bed-rhvk', ar: 'صفحة المنتج', en: 'Product page', group: 'shop', full: true, mobile: true },
      { key: 'lookbook', path: '/lookbook', ar: 'دفتر الإلهام', en: 'Lookbook', group: 'shop', full: true },
      { key: 'testimonials', path: '/testimonials', ar: 'آراء العملاء', en: 'Testimonials', group: 'shop', full: true },
      { key: 'about', path: '/about', ar: 'من نحن', en: 'About', group: 'shop', full: true },
      { key: 'contact', path: '/contact', ar: 'تواصل', en: 'Contact', group: 'shop' },
      { key: 'shipping', path: '/shipping', ar: 'سياسة الشحن', en: 'Shipping policy', group: 'shop' },
      { key: 'login', path: '/login', ar: 'تسجيل الدخول', en: 'Sign in', group: 'shop', mobile: true },
      { key: 'register', path: '/register', ar: 'إنشاء حساب', en: 'Register', group: 'shop' },
      // Signed in as a customer: put one piece in the bag so the cart and
      // checkout are photographed with something in them.
      { key: 'cart', path: '/product/classic-bed-rhvk', ar: 'السلة', en: 'Cart', group: 'account', as: 'customer', mobile: true,
        prep: async (page) => {
          await page.click('form[action$="/cart/add"] button[type=submit]').catch(() => {});
          await page.waitForLoadState('networkidle').catch(() => {});
          await page.goto(page.url().replace(/\/product\/.*$/, '/cart'), { waitUntil: 'networkidle' });
        } },
      { key: 'checkout', path: '/checkout', ar: 'إتمام الطلب', en: 'Checkout', group: 'account', as: 'customer', full: true, mobile: true },
      { key: 'orders', path: '/orders', ar: 'طلباتي', en: 'My orders', group: 'account', as: 'customer' },
      { key: 'rooms', path: '/wishlist', ar: 'غرفي والمفضّلة', en: 'Rooms & wishlist', group: 'account', as: 'customer', full: true },
      { key: 'profile', path: '/profile', ar: 'الملف الشخصي', en: 'Profile', group: 'account', as: 'customer' },
      { key: 'adm-dash', path: '/admin/dashboard', ar: 'نظرة عامة', en: 'Overview', group: 'admin', as: 'admin', full: true, mobile: true },
      { key: 'adm-products', path: '/admin/products', ar: 'المنتجات', en: 'Products', group: 'admin', as: 'admin', mobile: true },
      { key: 'adm-create', path: '/admin/products/create', ar: 'إضافة منتج', en: 'New product', group: 'admin', as: 'admin', full: true },
      { key: 'adm-cats', path: '/admin/categories', ar: 'التصنيفات', en: 'Categories', group: 'admin', as: 'admin' },
      { key: 'adm-orders', path: '/admin/orders', ar: 'الطلبات', en: 'Orders', group: 'admin', as: 'admin' },
      { key: 'adm-users', path: '/admin/users', ar: 'المستخدمون', en: 'Users', group: 'admin', as: 'admin' },
      { key: 'adm-reviews', path: '/admin/reviews', ar: 'الآراء', en: 'Reviews', group: 'admin', as: 'admin' },
      { key: 'adm-news', path: '/admin/newsletters', ar: 'النشرة البريدية', en: 'Newsletter', group: 'admin', as: 'admin' },
      { key: 'adm-contacts', path: '/admin/contacts', ar: 'رسائل التواصل', en: 'Contact messages', group: 'admin', as: 'admin' },
    ],
  },

  /* ---------------------------------------------------------- booking */
  booking: {
    base: 'http://127.0.0.1:5173',
    locales: ['ar'],
    roles: {
      operator: { path: '/login', email: 'input[type=email]', password: 'input[type=password]', user: 'operator@example.com', pass: PW, waitFor: '**/app**' },
    },
    groups: {
      public: { ar: 'موقع الزبون', en: 'Customer site' },
      app: { ar: 'كونسول التشغيل', en: 'Operator console' },
    },
    pages: [
      { key: 'home', path: '/', ar: 'الصفحة العامة', en: 'Public site', group: 'public', full: true, mobile: true },
      { key: 'book', path: '/book', ar: 'حجز موعد', en: 'Booking flow', group: 'public', full: true, mobile: true },
      { key: 'lookup', path: '/booking/BK-2026-0500', ar: 'حجزي بالمرجع', en: 'My booking', group: 'public' },
      { key: 'login', path: '/login', ar: 'تسجيل الدخول', en: 'Sign in', group: 'public' },
      { key: 'register', path: '/register', ar: 'إنشاء حساب', en: 'Register', group: 'public' },
      { key: 'board', path: '/app', ar: 'لوحة اليوم', en: 'Day board', group: 'app', as: 'operator', mobile: true },
      { key: 'calendar', path: '/app/calendar', ar: 'التقويم', en: 'Calendar', group: 'app', as: 'operator' },
      { key: 'analytics', path: '/app/analytics', ar: 'التحليلات', en: 'Analytics', group: 'app', as: 'operator', full: true },
      { key: 'bookings', path: '/app/bookings', ar: 'الحجوزات', en: 'Bookings', group: 'app', as: 'operator', mobile: true },
      { key: 'customers', path: '/app/customers', ar: 'العملاء', en: 'Customers', group: 'app', as: 'operator' },
      { key: 'settings', path: '/app/settings', ar: 'الإعدادات', en: 'Settings', group: 'app', as: 'operator', full: true },
    ],
  },

  /* ------------------------------------------------------- takharruj */
  grad: {
    base: 'http://127.0.0.1:8002',
    locales: ['ar'],
    roles: {
      admin: { path: '/login', email: '#identify', password: '#password', user: 'admin@admin.com', pass: 'adminadmin' },
      supervisor: { path: '/login', email: '#identify', password: '#password', user: 'mohammed.matar.9@supervisor.com', pass: 'adminadmin' },
      student: { path: '/login', email: '#identify', password: '#password', user: 'reham.siam.54@student.com', pass: 'adminadmin' },
    },
    groups: {
      site: { ar: 'الموقع التعريفي', en: 'Marketing site' },
      admin: { ar: 'لوحة المدير', en: 'Admin dashboard' },
      supervisor: { ar: 'لوحة المشرف', en: 'Supervisor dashboard' },
      student: { ar: 'لوحة الطالب', en: 'Student dashboard' },
    },
    pages: [
      { key: 'home', url: 'http://127.0.0.1:3006/', ar: 'الموقع التعريفي', en: 'Marketing site', group: 'site', full: true, mobile: true },
      { key: 'login', path: '/login', ar: 'تسجيل الدخول', en: 'Sign in', group: 'site', mobile: true },
      { key: 'dash', path: '/admin/dashboard', ar: 'نظرة عامة', en: 'Overview', group: 'admin', as: 'admin', full: true, mobile: true },
      { key: 'students', path: '/admin/students', ar: 'الطلبة', en: 'Students', group: 'admin', as: 'admin', mobile: true },
      { key: 'sups', path: '/admin/supervisors', ar: 'المشرفون', en: 'Supervisors', group: 'admin', as: 'admin' },
      { key: 'specialize', path: '/admin/specialize', ar: 'التخصصات', en: 'Specialisations', group: 'admin', as: 'admin' },
      { key: 'topics', path: '/admin/specialize/projects/1', ar: 'مواضيع التخصص', en: 'Topic catalogue', group: 'admin', as: 'admin' },
      { key: 'semesters', path: '/admin/semesters', ar: 'الفصول الدراسية', en: 'Semesters', group: 'admin', as: 'admin' },
      { key: 'groups', path: '/admin/groups/index', ar: 'المجموعات', en: 'Groups', group: 'admin', as: 'admin' },
      { key: 'group', path: '/admin/groups/33/show', ar: 'تفاصيل مجموعة', en: 'Group detail', group: 'admin', as: 'admin', full: true },
      { key: 'admins', path: '/admin/administrators', ar: 'المشرفون الإداريون', en: 'Administrators', group: 'admin', as: 'admin' },
      { key: 'contacts', path: '/admin/contacts/index', ar: 'رسائل التواصل', en: 'Contact messages', group: 'admin', as: 'admin' },
      { key: 'profile', path: '/admin/profile', ar: 'الملف الشخصي', en: 'Profile', group: 'admin', as: 'admin' },
      { key: 'sup-dash', path: '/supervisor/dashboard', ar: 'مشاريعي', en: 'My projects', group: 'supervisor', as: 'supervisor', full: true, mobile: true },
      { key: 'sup-requests', path: '/supervisor/dashboard/projects/request', ar: 'طلبات الإشراف', en: 'Supervision requests', group: 'supervisor', as: 'supervisor' },
      { key: 'sup-project', path: '/supervisor/projects/33', ar: 'إدارة مشروع', en: 'Project management', group: 'supervisor', as: 'supervisor', full: true, mobile: true },
      { key: 'sup-archive', path: '/supervisor/projects/archive', ar: 'الأرشيف', en: 'Archive', group: 'supervisor', as: 'supervisor' },
      { key: 'stu-dash', path: '/student/dashboard', ar: 'مشروعي', en: 'My project', group: 'student', as: 'student', full: true, mobile: true },
      { key: 'stu-explore', path: '/student/projects/explore', ar: 'استكشاف المواضيع', en: 'Explore topics', group: 'student', as: 'student' },
      { key: 'stu-requests', path: '/student/dashboard/projects/request', ar: 'الإشعارات', en: 'Notifications', group: 'student', as: 'student' },
      { key: 'stu-profile', path: '/student/profile', ar: 'الملف الشخصي', en: 'Profile', group: 'student', as: 'student' },
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
