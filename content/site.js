// Site-level content that is not a project: services, skills, timeline.
// Same rule as projects.js — nothing here that is not true of the real work.

// What a client can hire me for. Each one is named the way a client would
// name it, not the way a stack would, and each cites the project that already
// does it — a service with a case study behind it is a claim you can check.
// `proof` is a project slug, or null where nothing here demonstrates it yet.
export const SERVICES = [
  {
    icon: 'store', proof: 'diwan', visual: 'shop',
    ar: { h: 'متاجر إلكترونية', b: 'متجر عربي كامل: كتالوج ومخزون وسلّة وطلبات وفواتير. والمخزون يُحسم في قاعدة البيانات، فلا تُباع آخر قطعة مرّتين.' },
    en: { h: 'E-commerce', b: 'A complete Arabic store: catalogue, stock, cart, orders and invoices. Stock is settled in the database, so the last piece never sells twice.' },
    tier: 'core',
    for: { ar: 'متجر يبيع أونلاين، وخاصة بالعربية.', en: 'A shop that sells online, especially in Arabic.' },
    get: { ar: 'واجهة متجر وسلّة ودفع، ومخزون وطلبات وفواتير، ولوحة تحكم.', en: 'A storefront, cart and checkout, stock, orders and invoices, and an admin panel.' },
  },
  {
    icon: 'calendar', proof: 'booking', visual: 'book',
    ar: { h: 'أنظمة حجوزات ومواعيد', b: 'حجز من الجوال بلا حساب، وأوقات تُحسب من دوامك الحقيقي، ولا يحجز اثنان الموعد نفسه أبداً.' },
    en: { h: 'Booking systems', b: 'Booking from a phone with no account, times worked out from your real hours, and two people never get the same slot.' },
    tier: 'core',
    for: { ar: 'عيادات وصالونات ومراكز تدريب، وكل عمل يقوم على المواعيد.', en: 'Clinics, salons, training centres: any business that runs on appointments.' },
    get: { ar: 'صفحة حجز لعملائك، ولوحة يدير منها فريقك اليوم، وأوقات تُحسب من دوامك الحقيقي.', en: 'A booking page for your customers, a console for your team, and times worked out from your real hours.' },
  },
  {
    icon: 'layout', proof: 'opsight', visual: 'dash',
    ar: { h: 'أنظمة أعمال ولوحات تحكم', b: 'أدوار وصلاحيات وسير عمل، وجداول تبقى سريعة ولو صارت آلاف السجلات.' },
    en: { h: 'Business systems and dashboards', b: 'Roles, permissions and workflows, with tables that stay fast at thousands of rows.' },
    tier: 'core',
    for: { ar: 'منشأة يعمل فيها أكثر من دور على البيانات نفسها.', en: 'A business where several roles work on the same data.' },
    get: { ar: 'أدوار وصلاحيات يفحصها الخادم، وسير عمل، وجداول تبقى سريعة مع آلاف السجلات.', en: 'Roles and permissions checked on the server, workflows, and tables that stay fast at thousands of rows.' },
  },
  {
    icon: 'database', proof: 'lamma', visual: 'api',
    ar: { h: 'قواعد بيانات وواجهات برمجية', phrase: 'قواعد بيانات وواجهات برمجية', b: 'مخطّط يمنع الخطأ قبل أن يحدث، وAPI موثّق تحرسه اختبارات.' },
    en: { h: 'Database design and APIs', phrase: 'database design and APIs', b: 'A schema that stops the mistake before it happens, and a documented API held up by tests.' },
  },
  {
    // Figma to code. No project here claims a Figma source, so this one cites
    // no project: it names the stack it is delivered in instead, and its
    // picture is drawn, not a screenshot passed off as the result.
    icon: 'layout', proof: null, visual: 'figma', note: 'Vue 3 · Next.js · Tailwind CSS',
    ar: { h: 'تحويل تصاميم Figma إلى كود', b: 'أحوّل تصميمك إلى واجهة تعمل فعلاً: متجاوبة، بالعربية والإنجليزية، ووفيّة للمسافات والخطوط التي اخترتها.' },
    en: { h: 'Figma to code', b: 'I turn your design into a front end that actually works: responsive, in Arabic and English, true to the spacing and type you chose.' },
  },
  {
    // Testing is demonstrated in the work itself: Pest and PHPUnit suites in
    // all five projects, Playwright in three, and the booking system's
    // concurrency test opens two real sessions. A skill, not a job title.
    icon: 'shield', proof: 'booking', visual: 'tests',
    ar: { h: 'اختبارات وضمان جودة', phrase: 'اختبارات وضمان جودة', b: 'اختبارات آلية لتطبيق لارافيل قائم، حتى يبقى الخطأ الذي أصلحناه مُصلَحاً بعد التعديل التالي.' },
    en: { h: 'Testing & QA', phrase: 'testing & QA', b: 'Automated tests for an existing Laravel app, so a bug we fixed stays fixed after the next change.' },
  },
  {
    // Shown in Diwan's assistant and description drafts; listed without a
    // proof label by choice.
    icon: 'spark', proof: null, visual: 'ai',
    ar: { h: 'ربط الذكاء الاصطناعي بتطبيقك', phrase: 'ربط الذكاء الاصطناعي بتطبيقك', b: 'أربط نموذجاً مثل Claude ببيانات تطبيقك وقواعده: مساعد يجيب من بياناتك الحقيقية، ونصوص تُكتب من سجلّاتك، مقيّدة بما هو موجود فعلاً ومحروسة باختبارات.' },
    en: { h: 'AI integration', phrase: 'AI integration', b: 'I connect a model like Claude to your app’s own data and rules: an assistant that answers from your real data, text drafted from your records, held to what actually exists and covered by tests.' },
  },
  {
    icon: 'code', proof: null, visual: 'diff', note: 'Laravel · PHP',
    ar: { h: 'تطوير مشروع قائم', b: 'أكمل تطبيقاً موجوداً أو أصلحه: أقرأ الكود أولاً، ثم أصغر تغيير يحلّ المشكلة.' },
    en: { h: 'Work on an existing project', b: 'I finish or fix an app that already exists: I read the code first, then make the smallest change that solves it.' },
    tier: 'core',
    for: { ar: 'تطبيق موجود يحتاج إكمالاً أو إصلاحاً أو ميزة جديدة.', en: 'An application that already exists and needs finishing, fixing or a new feature.' },
    get: { ar: 'تغيير صغير ومقروء يحلّ المشكلة، واختبار يُبقيها محلولة.', en: 'A small, readable change that solves it, and a test that keeps it solved.' },
  },
];

// Capabilities grouped the way work divides, not rated out of five. The chips
// are only tools that appear in the stacks above; the counts underneath say in
// how many of the five projects each one is actually used, which is a fact
// about the work rather than an opinion about me.
export const CAPABILITIES = [
  {
    key: 'backend',
    ar: { h: 'الخلفية وقواعد البيانات', b: 'منطق العمل والصلاحيات والمعاملات على الخادم، وقواعد MySQL مصمّمة من الصفر.' },
    en: { h: 'Backend & database', b: 'Business logic, permissions and transactions on the server, on MySQL schemas designed from scratch.' },
    items: ['Laravel', 'PHP', 'MySQL', 'REST API'],
  },
  {
    key: 'frontend',
    ar: { h: 'تطوير الواجهات', b: 'Vue أو React حسب المشروع: لوحة تحكم بـ Vue، وتطبيق بـ Next.js.' },
    en: { h: 'Frontend development', b: 'Vue or React, chosen per project: a Vue console, a Next.js app.' },
    items: ['Vue 3', 'React', 'Next.js'],
  },
  {
    key: 'ui',
    ar: { h: 'بناء الواجهة', b: 'واجهات متجاوبة بالعربية والإنجليزية، من اليمين لليسار ومن اليسار لليمين.' },
    en: { h: 'UI development', b: 'Responsive interfaces in Arabic and English, right to left and left to right.' },
    items: ['Tailwind CSS'],
  },
  {
    key: 'testing',
    ar: { h: 'الهندسة والاختبار', b: 'اختبارات PHP للقواعد، وVitest لمنطق الواجهة، وPlaywright في المتصفح.' },
    en: { h: 'Engineering & testing', b: 'PHP tests for the rules, Vitest for the interface logic, Playwright in the browser.' },
    items: ['Pest', 'PHPUnit', 'Vitest', 'Playwright'],
  },
  {
    key: 'ai',
    ar: { h: 'ربط الذكاء الاصطناعي', b: 'نماذج مثل Claude مربوطة ببيانات التطبيق وقواعده، بإجابات مقيّدة بشكل محدّد وأدوات للقراءة فقط.' },
    en: { h: 'AI integration', b: 'Models like Claude wired to the app’s own data and rules, with answers held to a fixed shape and read-only tools.' },
    items: ['Claude API'],
  },
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
    file: 'DisbursementRecordTest.php', project: 'lamma',
    ar: 'من سجّل الصرف لا يستطيع اعتماده',
    en: 'Whoever recorded a disbursement cannot approve it',
    probAr: 'شخص واحد يسجّل عملية صرف ويعتمدها بنفسه.',
    probEn: 'One person records a disbursement and signs it off themselves.',
    decAr: 'السياسة تفحص ذلك في الكود لا في الواجهة، والمعتمَد يُعكَس بقيد مضاد لا يُعدَّل.',
    decEn: 'The policy checks that in code rather than in the interface, and an approved record is reversed with a counter-entry rather than edited.',
  },
  {
    file: 'FieldRedactionTest.php', project: 'opsight',
    ar: 'الموظف لا يتسلّم تكلفة المنتج، لا في القائمة ولا في صفحته',
    en: 'Staff never receive a product’s cost, on the list or on its own page',
    probAr: 'تكلفة مخفية في الشاشة تبقى ظاهرة لمن يفتح أدوات المتصفح.',
    probEn: 'A cost hidden on screen is still there for anyone who opens the browser’s tools.',
    decAr: 'الحقل الذي لا يحق للدور أن يراه يُحذف من استجابة الـ API نفسها، لا يُخفى في الواجهة.',
    decEn: 'A field a role may not see is left out of the API response itself, not hidden in the interface.',
  },
  {
    file: 'PassageTest.php', project: 'diwan',
    ar: 'لا يُقال إن القطعة تمرّ وخطوة على طريقها لم تُقَس',
    en: 'A piece is never said to get in while a step on its way is unmeasured',
    probAr: 'كنبة تتّسع للغرفة ثم تعلق في المصعد أو عند منعطف الدرج.',
    probEn: 'A sofa that fits the room sticks in the lift or at the turn of the stairs.',
    decAr: 'الطريق يُمشى خطوةً خطوة بهامش ٢ سم من كل جانب، وأسوأ خطوة تقرّر، وما لم يُقَس يبقى «لم يُفحص».',
    decEn: 'The way in is walked step by step with a 2 cm margin a side; the worst step decides, and an unmeasured one stays unchecked.',
  },
  {
    file: 'OrphanGridSortTest.php', project: 'lamma',
    ar: 'شبكة الأيتام تُفرز على الفهرس، لا بـ filesort',
    en: 'The orphan grid sorts on the index, never with a filesort',
    probAr: 'الصفحة التي تُظهر الأقلّ كفالةً كانت تبطؤ كلّما زاد عدد الأيتام.',
    probEn: 'The page that finds the least-funded children slowed down as more were added.',
    decAr: 'اتجاها الفرز وُحِّدا ليقرأ المحرّك الفهرس عكسياً، ويخدمه فهرس على (status, funded_percent, id).',
    decEn: 'Both sort directions were made the same so the engine reads the index backwards, served by an index on (status, funded_percent, id).',
  },
];

// Working rules shown on the home page timeline. Every one of them is
// something a project in projects.js actually does — see the note on each.
export const PROCESS = {
  ar: [
    { h: 'العربية من أول سطر', b: 'الاتجاه مبني في التخطيط، لا معكوس في النهاية. الأرقام والأيقونات والفلاتر لا تخرج عن مكانها.' },
    { h: 'القواعد في طبقة البيانات', b: 'الصلاحيات والمخزون والتزامن تُحسم في قاعدة البيانات داخل المعاملة نفسها، لا بإخفاء زرّ في الواجهة.' },
    { h: 'اختبار لكل قاعدة تهمّ', b: 'ما لا يفحصه اختبار سينكسر بعد أول تعديل يكتبه أحد بعدي. حتى قواعد نظام التصميم مكتوبة كاختبارات.' },
    // Lamma: date_of_birth not age. Booking: availability computed not stored.
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
