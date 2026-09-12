// Site-level content that is not a project: services, skills, timeline.
// Same rule as projects.js — nothing here that is not true of the real work.

export const SERVICES = [
  {
    icon: 'layers',
    ar: {
      h: 'تطبيقات ويب كاملة',
      b: 'من مخطط قاعدة البيانات إلى الواجهة، بلارافيل وPHP. منتج يعمل، لا شاشات عرض.',
    },
    en: {
      h: 'Complete web applications',
      b: 'From the database schema to the interface, in Laravel and PHP. A product that works, not screen mockups.',
    },
  },
  {
    icon: 'layout',
    ar: {
      h: 'واجهات تفاعلية بـ Vue',
      b: 'لوحات تحكم وكونسولات تشغيل بـ Vue 3 وPinia وTailwind، مربوطة بـ API حقيقي.',
    },
    en: {
      h: 'Interactive front ends in Vue',
      b: 'Dashboards and operator consoles in Vue 3, Pinia and Tailwind, wired to a real API.',
    },
  },
  {
    icon: 'database',
    ar: {
      h: 'قواعد بيانات وواجهات برمجية',
      b: 'المخزون والتزامن والصلاحيات تُحسم في MySQL داخل المعاملة نفسها، وREST API موثّق ومختبَر.',
    },
    en: {
      h: 'Database design and APIs',
      b: 'Stock, concurrency and permissions are settled in MySQL inside the transaction itself, with a documented, tested REST API.',
    },
  },
  {
    icon: 'languages',
    ar: {
      h: 'عربي RTL من أول سطر',
      b: 'الاتجاه مبني في التخطيط لا معكوس في النهاية. الأرقام والأيقونات والفلاتر في مكانها الصحيح.',
    },
    en: {
      h: 'Arabic-first, RTL by design',
      b: 'Direction is built into the layout, not mirrored at the end. Numbers, icons and filters stay where they belong.',
    },
  },
];

export const SKILLS = [
  'Laravel 12', 'PHP 8.2', 'MySQL', 'Vue 3', 'Pinia', 'Vite', 'Tailwind CSS', 'Blade',
  'REST APIs', 'Sanctum', 'Pest', 'Playwright', 'Yajra DataTables', 'Next.js', 'Git', 'RTL / i18n',
];

export const CORE = {
  ar: ['Laravel', 'PHP', 'Vue 3', 'MySQL', 'REST APIs', 'Tailwind', 'اختبارات', 'RTL'],
  en: ['Laravel', 'PHP', 'Vue 3', 'MySQL', 'REST APIs', 'Tailwind', 'Testing', 'RTL'],
};

// Skill bars are NOT self-assessed percentages: each bar is how many of the
// projects above use that tool. `match` maps the raw stack names onto one row.
export const SKILL_ROWS = [
  { icon: 'layers', match: /^laravel/i, ar: 'Laravel', en: 'Laravel' },
  { icon: 'code', match: /^php/i, ar: 'PHP', en: 'PHP' },
  { icon: 'database', match: /^mysql/i, ar: 'MySQL', en: 'MySQL' },
  { icon: 'layout', match: /^(vue|pinia)/i, ar: 'Vue 3 + Pinia', en: 'Vue 3 + Pinia' },
  { icon: 'sparkles', match: /^(blade|tailwind)/i, ar: 'Blade + Tailwind', en: 'Blade + Tailwind' },
  { icon: 'shield', match: /^(pest|phpunit|playwright)/i, ar: 'اختبارات Pest / Playwright', en: 'Pest / Playwright tests' },
];

// Working traits — each one is demonstrated somewhere in projects.js.
export const TRAITS = {
  ar: ['عربي RTL أولاً', 'تصميم قواعد البيانات', 'REST APIs', 'التزامن والأقفال', 'اختبارات على القواعد', 'مفتوح المصدر'],
  en: ['Arabic-first RTL', 'Database design', 'REST APIs', 'Concurrency & locks', 'Tests on the rules', 'Open source'],
};

// Client quotes. Leave empty and the section is not rendered.
// Each item: { ar: { quote, name, role }, en: { quote, name, role } }
export const TESTIMONIALS = [];

// The hero "test run". Every entry is a real test file in one of the projects
// above, and the sentence is the rule that test protects.
export const HERO_TESTS = [
  { file: 'ConcurrentBookingTest.php', project: 'booking', ar: 'مشغّلان يؤكّدان الموعد نفسه في الثانية نفسها: الثاني يخسر', en: 'Two operators confirm the same slot in the same second: the second one loses' },
  { file: 'StockTest.php', project: 'diwan', ar: 'آخر قطعة في المخزون لا تُباع مرّتين', en: 'The last piece in stock cannot be sold twice' },
  { file: 'OrderHistoryTest.php', project: 'diwan', ar: 'سطر الطلب يبقى بعد سحب المنتج من الكتالوج', en: 'An order line survives the product being retired' },
  { file: 'DisbursementRecordTest.php', project: 'kafala', ar: 'من سجّل الصرف لا يستطيع اعتماده', en: 'Whoever recorded a disbursement cannot approve it' },
  { file: 'PortfolioManagementTest.php', project: 'mawaheb', ar: 'الخطة المجانية تحدّ عدد الأعمال المنشورة', en: 'The free plan caps published portfolio items' },
  { file: 'DesignSystemTest.php', project: 'diwan', ar: 'لا لون في القوالب خارج ملف الرموز', en: 'No colour in a template outside the token file' },
];

// Working rules shown on the home page timeline. Every one of them is
// something a project in projects.js actually does — see the note on each.
export const PROCESS = {
  ar: [
    { h: 'العربية من أول سطر', b: 'الاتجاه مبني في التخطيط، لا معكوس في النهاية. الأرقام والأيقونات والفلاتر لا تخرج عن مكانها.' },
    { h: 'القواعد في طبقة البيانات', b: 'الصلاحيات والمخزون والتزامن تُحسم في قاعدة البيانات داخل المعاملة نفسها، لا بإخفاء زرّ في الواجهة.' },
    { h: 'اختبار لكل قاعدة تهمّ', b: 'ما لا يفحصه اختبار سينكسر بعد أول تعديل يكتبه أحد بعدي. حتى قواعد نظام التصميم مكتوبة كاختبارات.' },
    // Kafala: date_of_birth not age. Booking: availability computed not stored.
    { h: 'الحقيقة تُخزَّن، والمشتقّ يُحسب', b: 'تاريخ الميلاد لا العمر، والأوقات المتاحة تُولَّد من القواعد لا تُكتب في جدول. الرقم الذي يُحفظ مرّتين سيختلف يوماً ما.' },
    // Diwan: order lines survive catalogue. Kafala: approved records reversed, never edited.
    { h: 'السجلّ لا يُمحى', b: 'سطر الطلب يبقى بعد حذف المنتج، والقيد المعتمَد لا يُعدَّل بل يُعكَس بقيد مضاد. ما حدث فعلاً يجب أن يبقى قابلاً للقراءة.' },
    // Takharruj: server-side tables. Kafala: idempotency key on payments.
    { h: 'يعمل عند ٥٠٠ سجل كما عند ٥٠٠٠', b: 'الترقيم والفرز والبحث في قاعدة البيانات لا في المتصفح، والطلب المكرّر يُرفض بالمحرّك نفسه لا بانضباط في الكود.' },
  ],
  en: [
    { h: 'Arabic from the first line', b: 'Direction is built into the layout, not mirrored at the end. Numbers, icons and filters stay where they belong.' },
    { h: 'Rules live in the data layer', b: 'Permissions, stock and concurrency are settled in the database inside the same transaction, not by hiding a button in the interface.' },
    { h: 'A test for every rule that matters', b: 'Anything no test checks will break after the first edit somebody writes after me. Even the design-system rules are written as tests.' },
    { h: 'Store the fact, derive the rest', b: 'A date of birth rather than an age; free slots generated from rules rather than written into a table. A number saved twice will disagree one day.' },
    { h: 'History is never deleted', b: 'An order line outlives the product; an approved entry is reversed with a counter-entry, never edited. What actually happened must stay readable.' },
    { h: 'Works at 500 rows like at 5,000', b: 'Pagination, sorting and search happen in the database, not the browser, and a duplicate request is rejected by the engine, not by code discipline.' },
  ],
};

// Experience / education timeline. Leave empty and the section is not rendered.
// Each item: { period: '2024 — 2026', ar: { h, org, b }, en: { h, org, b } }
export const TIMELINE = [];
