// Site-level content that is not a project: services, skills, timeline.
// Same rule as projects.js — nothing here that is not true of the real work.

// What a client can hire me for. Each one is named the way a client would
// name it, not the way a stack would, and each cites the project that already
// does it — a service with a case study behind it is a claim you can check.
// `proof` is a project slug, or null where nothing here demonstrates it yet.
export const SERVICES = [
  {
    icon: 'store', proof: 'diwan',
    ar: { h: 'متاجر إلكترونية', b: 'كتالوج ومخزون وسلّة وطلبات — والمخزون يُحسم في قاعدة البيانات، فلا تُباع آخر قطعة مرّتين.' },
    en: { h: 'E-commerce', b: 'Catalogue, stock, cart and orders — with stock settled in the database, so the last piece cannot sell twice.' },
  },
  {
    icon: 'calendar', proof: 'booking',
    ar: { h: 'أنظمة حجوزات ومواعيد', b: 'التوفّر يُحسب من ساعات العمل ومدّة الخدمة، وكشف التعارض يمنع فوز اثنين بالموعد نفسه.' },
    en: { h: 'Booking systems', b: 'Availability computed from business hours and service duration, with conflict detection that stops two people winning the same slot.' },
  },
  {
    icon: 'layout', proof: 'takharruj',
    ar: { h: 'أنظمة أعمال ولوحات تحكم', b: 'أدوار وصلاحيات وسير عمل وجداول من جهة الخادم تبقى سريعة عند آلاف السجلات.' },
    en: { h: 'Business systems and dashboards', b: 'Roles, permissions, workflows, and server-side tables that stay fast at thousands of rows.' },
  },
  {
    icon: 'database', proof: 'kafala',
    ar: { h: 'قواعد بيانات وواجهات برمجية', b: 'مخطّط يمنع الخطأ بدل أن يكتشفه، وREST API موثّق تحرسه اختبارات.' },
    en: { h: 'Database design and APIs', b: 'A schema that prevents the mistake rather than detecting it, and a documented REST API held up by tests.' },
  },
  {
    icon: 'languages', proof: 'mawaheb',
    ar: { h: 'عربي RTL من أول سطر', b: 'الاتجاه مبني في التخطيط لا معكوس في النهاية. الأرقام والأيقونات والفلاتر في مكانها الصحيح.' },
    en: { h: 'Arabic-first, RTL by design', b: 'Direction is built into the layout, not mirrored at the end. Numbers, icons and filters stay where they belong.' },
  },
  {
    icon: 'code', proof: null,
    ar: { h: 'تطوير مشروع قائم', b: 'إكمال أو إصلاح أو توسيع تطبيق لارافيل موجود — قراءة الكود أولاً، ثم أصغر تغيير يحلّ المشكلة.' },
    en: { h: 'Work on an existing project', b: 'Finishing, fixing or extending a Laravel application that already exists — reading the code first, then the smallest change that solves it.' },
  },
];

// Capabilities grouped the way work divides, not rated out of five. The chips
// are only tools that appear in the stacks above; the counts underneath say in
// how many of the five projects each one is actually used, which is a fact
// about the work rather than an opinion about me.
export const CAPABILITIES = [
  {
    icon: 'layers',
    ar: { h: 'الواجهة الخلفية', b: 'منطق العمل والصلاحيات والمعاملات، وواجهات REST.' },
    en: { h: 'Backend', b: 'Business logic, permissions, transactions and REST APIs.' },
    items: ['Laravel 12', 'PHP 8.2', 'REST APIs', 'Sanctum', 'Breeze', 'Socialite'],
  },
  {
    icon: 'layout',
    ar: { h: 'الواجهة الأمامية', b: 'لوحات وكونسولات وواجهات عربية.' },
    en: { h: 'Frontend', b: 'Dashboards, operator consoles and Arabic interfaces.' },
    items: ['Vue 3', 'Pinia', 'Vite', 'Blade', 'Tailwind CSS', 'Next.js'],
  },
  {
    icon: 'database',
    // Was the services line repeated. Kafala's first point is the fact that
    // belongs to this layer and to nothing else on the page.
    ar: { h: 'البيانات', b: 'خمسة مخطّطات من الصفر على MySQL — منها قيد فريد جزئي على محرّك لا يملك واحداً.' },
    en: { h: 'Data', b: 'Five schemas designed from scratch on MySQL — including a partial unique constraint on an engine that has none.' },
    items: ['MySQL', 'تصميم المخطّط', 'المعاملات والأقفال', 'Yajra DataTables'],
    itemsEn: ['MySQL', 'Schema design', 'Transactions & locks', 'Yajra DataTables'],
  },
  {
    icon: 'shield',
    // Was the fourth copy of the `اختبار لكل قاعدة تهمّ` line. What is true of
    // this layer alone: two PHP runners plus a browser one, and the
    // concurrency test opens two real sessions rather than simulating them.
    ar: { h: 'الجودة', b: 'اختبارات PHP للقواعد وPlaywright للمتصفّح — واختبار التزامن يفتح جلستين حقيقيتين لا محاكاة.' },
    en: { h: 'Quality', b: 'PHP tests for the rules and Playwright for the browser — and the concurrency test opens two real sessions rather than simulating them.' },
    items: ['Pest', 'PHPUnit', 'Playwright', 'التحقّق والصلاحيات', 'قواعد العمل'],
    itemsEn: ['Pest', 'PHPUnit', 'Playwright', 'Validation & policies', 'Business rules'],
  },
];

export const SKILLS = [
  'Laravel 12', 'PHP 8.2', 'MySQL', 'Vue 3', 'Pinia', 'Vite', 'Tailwind CSS', 'Blade',
  'REST APIs', 'Sanctum', 'Pest', 'Playwright', 'Yajra DataTables', 'Next.js', 'Git', 'RTL / i18n',
];

// Client quotes. Leave empty and the section is not rendered.
// Each item: { ar: { quote, name, role }, en: { quote, name, role } }
export const TESTIMONIALS = [];

// The hero "test run". Every entry is a real test file in one of the projects
// above, and the sentence is the rule that test protects.
// Each entry is a real test file in one of the projects above. `ar`/`en` is
// the rule the test protects — the hero runner prints those. `prob` and `dec`
// split that rule into the two halves a reader needs in that order: what goes
// wrong for the business, and what was decided about it. Both are lifted from
// the technical points in projects.js, not written fresh.
export const HERO_TESTS = [
  {
    file: 'ConcurrentBookingTest.php', project: 'booking',
    ar: 'مشغّلان يؤكّدان الموعد نفسه في الثانية نفسها: الثاني يخسر',
    en: 'Two operators confirm the same slot in the same second: the second one loses',
    probAr: 'زبونان يطلبان الموعد نفسه في اللحظة نفسها.',
    probEn: 'Two customers ask for the same slot at the same moment.',
    decAr: 'الـAPI يقفل صف المورد قبل فحص التداخل، داخل المعاملة التي تكتب الحجز.',
    decEn: 'The API locks the resource row before testing for an overlap, inside the transaction that writes the booking.',
  },
  {
    file: 'StockTest.php', project: 'diwan',
    ar: 'آخر قطعة في المخزون لا تُباع مرّتين',
    en: 'The last piece in stock cannot be sold twice',
    probAr: 'آخر قطعة في المخزون يشتريها زبونان معاً.',
    probEn: 'Two customers buy the last piece in stock at once.',
    decAr: 'الشراء يقفل صف المنتج بـ lockForUpdate داخل المعاملة نفسها التي تكتب الطلب.',
    decEn: 'Checkout locks the product row with lockForUpdate inside the transaction that writes the order.',
  },
  {
    file: 'OrderHistoryTest.php', project: 'diwan',
    ar: 'سطر الطلب يبقى بعد سحب المنتج من الكتالوج',
    en: 'An order line survives the product being retired',
    probAr: 'سحب قطعة من الكتالوج كان يمحوها من كل طلب سابق.',
    probEn: 'Retiring a piece used to erase it from every past order.',
    decAr: 'الأعمدة تُفرَّغ بدل أن تُحذف، ولقطة الاسم والصورة محفوظة مع السطر نفسه.',
    decEn: 'The columns release instead of cascading, and a name and image snapshot travel with the line.',
  },
  {
    file: 'DisbursementRecordTest.php', project: 'kafala',
    ar: 'من سجّل الصرف لا يستطيع اعتماده',
    en: 'Whoever recorded a disbursement cannot approve it',
    probAr: 'شخص واحد يسجّل عملية صرف ويعتمدها بنفسه.',
    probEn: 'One person records a disbursement and signs it off themselves.',
    decAr: 'السياسة تفحص ذلك في الكود لا في الواجهة، والمعتمَد يُعكَس بقيد مضاد لا يُعدَّل.',
    decEn: 'The policy checks that in code rather than in the interface, and an approved record is reversed with a counter-entry rather than edited.',
  },
  {
    file: 'PortfolioManagementTest.php', project: 'mawaheb',
    ar: 'الخطة المجانية تحدّ عدد الأعمال المنشورة',
    en: 'The free plan caps published portfolio items',
    probAr: 'حدّ الخطة المجانية يُتجاوز بالنشر المتكرّر.',
    probEn: 'The free plan cap is walked past by publishing again.',
    decAr: 'الحدّ مفروض في طبقة البيانات، لا بإخفاء الزرّ في الواجهة.',
    decEn: 'The cap is enforced in the data layer, not by hiding the button.',
  },
  {
    file: 'DesignSystemTest.php', project: 'diwan',
    ar: 'لا لون في القوالب خارج ملف الرموز',
    en: 'No colour in a template outside the token file',
    probAr: 'قاعدة تصميم لا يفحصها أحد ترجع بعد أول تعديل.',
    probEn: 'A design rule nobody checks comes back after the first edit.',
    decAr: 'القواعد مكتوبة كاختبارات على قوالب Blade، لا كاتفاق شفهي.',
    decEn: 'The rules are written as unit tests over the Blade templates rather than agreed verbally.',
  },
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
