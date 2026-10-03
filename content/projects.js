// Every line here is drawn from the project's own README and source.
// If a claim is not in the repo, it is not in this file.

export const PROJECTS = [
  {
    slug: 'diwan',
    // The eight screens the case study actually argues about; the rest of
    // the capture set stays available behind the full gallery.
    tour: ['home', 'catalogue', 'product', 'rooms', 'cart', 'checkout', 'adm-dash', 'adm-orders'],
    shots: 'diwan',
    // The product page, not the catalogue: its top already carries the
    // "fit against your room" panel, which is the idea in one glance.
    cover: 'product',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Tailwind', 'Pest'],
    repo: 'https://github.com/ahmedalhawajri89/diwan-e-commerce',
    ar: {
      name: 'ديوان',
      kind: 'متجر أثاث عربي',
      tagline: 'يقيس الزبون غرفته مرّة، فتُجيبه كل قطعة: هل تدخل؟',
      summary:
        'أكثر فئة يفشل فيها الشراء أونلاين هي الأثاث، والسبب بسيط: الكنبة عرضها ٢٤٠ سم والزبون لا يعرف هل ٢٤٠ مناسبة أم لا. الأبعاد مكتوبة في جدول مواصفات لا يتخيّله أحد، فتصل القطعة ولا تدخل من الباب. ديوان ينقل هذا السؤال إلى الواجهة: الزبون يحفظ غرفته بعرضها وطولها، ومن تلك اللحظة كل صفحة منتج تعطيه حكماً على غرفته هو، لا رقماً في جدول.',
      points: [
        {
          h: 'حكم «هل تدخل؟» حسابٌ بقواعد، لا تلميح',
          b: 'القطعة يجب أن تتّسع لأطول جدار، وألّا تأخذ أكثر من نصف الأرضية، وأن يكون أحد أوجهها أقل من ٨٠ سم لتمرّ من الباب. وحين تُكسر أكثر من قاعدة يُقال للزبون أسوأها لا أوّلها. غرفة بلا قياسات جوابها مختلف عن منتج بلا أبعاد، والواجهة تفرّق بينهما.',
        },
        {
          h: 'المخزون يُحسم في قاعدة البيانات لا في PHP',
          b: 'الشراء يقفل صف المنتج بـ lockForUpdate داخل المعاملة نفسها التي تكتب الطلب، فلا يفوز اثنان بآخر قطعة. وسلّة فيها سطر غير متوفّر تفشل كاملةً: لا يُخصم شيء ولا يبقى طلب ناقص. وإلغاء الطلب يعيد المخزون مرّة واحدة مهما حُفظ الطلب بعدها.',
        },
        {
          h: 'سجلّ الطلبات يبقى بعد أن يختفي المنتج',
          b: 'سطر الطلب يسجّل ما اشتراه أحدهم، والكتالوج يعرض ما يُباع اليوم. كانا مربوطين بـ cascade فكان سحب قطعة قديمة يمحوها من كل طلب سابق. صارت الأعمدة تُفرَّغ بدل أن تُحذف، ولقطة الاسم والصورة محفوظة مع السطر نفسه.',
        },
        {
          h: 'نظام التصميم تحرسه اختبارات لا انضباط شخصي',
          b: 'قاعدة لا يفحصها أحد هي قاعدة سترجع. فالقواعد مكتوبة كاختبارات على قوالب Blade: لا لون خارج tokens.css، ولا style مضمّن إلا لقيمة تُحسب وقت العرض، ولا استعلام داخل قالب، وكل صورة تمرّ عبر مكوّن واحد.',
        },
      ],
    },
    en: {
      name: 'Diwan',
      kind: 'Arabic-first furniture store',
      tagline: 'The customer measures a room once, and every piece answers: does it fit?',
      summary:
        'Furniture is where online shopping fails most often, and the reason is dull: a sofa is 240 cm wide and the buyer has no idea whether 240 cm is fine. Diwan moves that question to the front — a customer saves a room with its width and length, and from then on every product page gives a verdict against that room rather than a number in a table.',
      points: [
        {
          h: 'The fit verdict is arithmetic with a rule set, not a hint',
          b: 'A piece has to fit the longest wall, take no more than half the floor, and have at least one face under 80 cm so it clears a doorway. When more than one rule is broken the customer is told the worst one, not the first checked. A room with no measurements and a product with no dimensions are different answers, and the interface says so.',
        },
        {
          h: 'Stock is decided in the database, not in PHP',
          b: 'Checkout locks the product row with lockForUpdate inside the transaction that writes the order, so two customers reaching for the last piece cannot both succeed. A cart with one unavailable line fails whole. Cancelling returns the stock exactly once.',
        },
        {
          h: 'Order history survives the catalogue',
          b: 'An order line records what somebody bought; the catalogue lists what is for sale today. Retiring a piece used to delete it from every past order. The columns now release instead of cascade, and a name and image snapshot carry the record.',
        },
        {
          h: 'The design system is enforced by tests',
          b: 'The rules are unit tests over the Blade templates: no colour outside tokens.css, no inline style unless computed at render time, no query inside a template, every photograph through one component.',
        },
      ],
    },
  },

  {
    slug: 'booking',
    // The eight screens the case study actually argues about; the rest of
    // the capture set stays available behind the full gallery.
    tour: ['home', 'book', 'lookup', 'board', 'calendar', 'bookings', 'analytics', 'customers'],
    shots: 'booking',
    cover: 'board',
    year: '2026',
    stack: ['Vue 3.5', 'Vite 6', 'Tailwind 4', 'Pinia', 'Laravel 12', 'MySQL', 'Playwright'],
    repo: 'https://github.com/ahmedalhawajri89/booking-management-system',
    demo: 'https://booking-management-system-xi.vercel.app/',
    ar: {
      name: 'نظام الحجوزات',
      kind: 'حجز مواعيد وكونسول تشغيل',
      tagline: 'الأوقات المتاحة تُحسب، ولا تُخزَّن — ولا يفوز اثنان بالموعد نفسه.',
      summary:
        'نظام حجز مواعيد عربي أولاً: الزبون يحجز خدمة أونلاين بلا إنشاء حساب، والمنشأة تدير يومها كاملاً من كونسول واحد. مبني كمنتج كامل لا كواجهة عرض — منطق التوفّر وكشف التعارض وسير الحالات كلها حقيقية.',
      points: [
        {
          h: 'التوفّر يُحسب ولا يُخزَّن',
          b: 'الأوقات الحرّة تُولَّد من مدّة الخدمة، ووقت الفاصل بين موعدين، والمورد المحجوز، وساعات العمل لذلك اليوم من الأسبوع. وأوقات اليوم التي مضت تُستبعد تلقائياً.',
        },
        {
          h: 'التعارض يُكشف بتداخل فترات نصف مفتوحة',
          b: 'aStart < bEnd && bStart < aEnd — فموعد ينتهي ١٠:٠٠ وآخر يبدأ ١٠:٠٠ لا يتعارضان، وأي تداخل حقيقي يتعارض. والحجوزات الملغاة تحرّر وقتها فوراً.',
        },
        {
          h: 'والقاعدة مطبَّقة حيث يهمّ فعلاً',
          b: 'شبكة الأوقات لا تعرض وقتاً محجوزاً، والمتجر يفحص قبل الكتابة، لكن أياً منهما لا يمنع مشغّلَين من تأكيد الموعد نفسه في الثانية نفسها. الـ API يقفل صف المورد قبل فحص التداخل داخل المعاملة التي تكتب الحجز. واختبار بجلستين حقيقيتين يثبت ذلك، لا تعليق في الكود.',
        },
        {
          h: 'لوحة اليوم بخط زمن حيّ',
          b: 'المشغّل يفتح على جدول اليوم مقابل خط «الآن»، وطابور «يحتاج إجراء» يُظهر الحجوزات غير المؤكّدة أو غير المدفوعة. تغيير الحالة والدفع بضغطة واحدة، ولكل تغيير تراجع.',
        },
      ],
    },
    en: {
      name: 'Booking System',
      kind: 'Appointment booking and operator console',
      tagline: 'Availability is computed, not stored — and two operators cannot win the same slot.',
      summary:
        'An Arabic-first appointment booking system: customers book a service online without creating an account, and the business manages the whole day from one console. Built as a complete product rather than a screen mockup — the availability logic, conflict detection and status workflow are all real.',
      points: [
        {
          h: 'Availability is computed, not stored',
          b: 'Free slots are generated from the service duration, the buffer between appointments, the resource being booked and the business hours for that weekday. Past times on the current day are excluded automatically.',
        },
        {
          h: 'Conflicts use half-open interval overlap',
          b: 'aStart < bEnd && bStart < aEnd — so an appointment ending at 10:00 and one starting at 10:00 do not collide, while any real overlap does. Cancelled bookings free their slot immediately.',
        },
        {
          h: 'And the rule is enforced where it counts',
          b: 'The API locks the resource row before it tests for an overlap, inside the transaction that writes the booking. ConcurrentBookingTest proves it with two live connections rather than asserting it in a comment.',
        },
        {
          h: 'A day board with a live now-line',
          b: "The operator opens on today's schedule against a live now-line, with a needs-attention queue for unconfirmed and unpaid bookings. Status and payment change in one click, with undo.",
        },
      ],
    },
  },

  {
    slug: 'takharruj',
    // The eight screens the case study actually argues about; the rest of
    // the capture set stays available behind the full gallery.
    tour: ['home', 'stu-dash', 'sup-project', 'defenses', 'sup-discussion', 'dash', 'stu-grade', 'login'],
    shots: 'grad',
    // The "project journey" home: the whole idea in one picture.
    cover: 'home',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Vanilla JS', 'Yajra DataTables', 'PHPUnit'],
    repo: 'https://github.com/ahmedalhawajri89/graduation-project-tracker',
    ar: {
      name: 'تخرُّج',
      kind: 'منصة إدارة مشاريع التخرج',
      tagline: 'رحلة المشروع من الفكرة حتى الدرجة — لكل دور لوحته، وبالعربية والإنجليزية.',
      summary:
        'مشاريع التخرج تُدار عادةً على جداول إكسل وسلاسل بريد وورق، فلا يملك أحد جواباً واحداً على «أي مجموعات بلا مشرف» أو «أي مراحل تأخّرت» أو «متى مناقشة فريقي ومن لجنتها». هذه المنصة تضع ذلك كله في مكان واحد: الطالب يرى فريقه واقفاً عند مرحلته على مسار المشروع، والمشرف يراجع ويقيّم، والإدارة تجدول المناقشات وتتابع الفصل كلّه.',
      points: [
        {
          h: 'ثلاثة أدوار، ولكلٍّ مساحته',
          b: 'حرّاس مصادقة ومجموعات مسارات منفصلة للطالب والمشرف والإدارة، فلا يرى أحد إلا ما يخصّه — ونقاش الفريق الخاص لا يصل المشرف ولا الإدارة. واللوحات الثلاث بالعربية والإنجليزية، واللغة تتبع المستخدم من الموقع حتى اللوحة.',
        },
        {
          h: 'المناقشات بلجانها ومحاضرها',
          b: 'مخطِّط أسبوعي يقترح لكل مشروع مكتمل موعداً وقاعة، ولجنة من أكثر من ممتحن برئيس، ويرفع قائد الفريق عرضه التقديمي قبل الموعد. وبعدها محضر مناقشة جاهز للطباعة، ودرجة نهائية تجمع درجات اللجنة مع وزن اختياري لدرجة المشرف.',
        },
        {
          h: 'حيّ بلا إعادة تحميل',
          b: 'الإشعارات وأرقام الشريط الجانبي تتحدّث وحدها، ورسائل النقاش تصل وتُرسل وتُحذف في مكانها. ورفع الملفات بشريط تقدّم يمكن إلغاؤه، وكل حذف أو قرار يسأل بنافذة تأكيد واحدة بدل confirm() المتصفّح.',
        },
        {
          h: 'نسخة عرض تجرَّب بنقرة',
          b: 'في وضع العرض: أزرار «جرّب كطالب / مشرف / مسؤول» بلا تسجيل، وحماية تمنع ما يخرّب النسخة للزائر التالي، وإعادة البيانات كل ليلة من لقطة محفوظة مع إزاحة التواريخ لتبقى المواعيد قريبة.',
        },
      ],
    },
    en: {
      name: 'Takharruj',
      kind: 'Graduation project management platform',
      tagline: 'A project’s journey from idea to grade — a dashboard per role, in Arabic and English.',
      summary:
        'Graduation projects are usually run on spreadsheets, email threads and paper. Nobody has a single answer to "which groups have no supervisor yet", "which milestones are overdue" or "when is my team’s defense, and who sits on it". This platform puts all of that in one place: students see their team standing at its current step on the project path, supervisors review and grade, and the department schedules defenses and follows the whole term.',
      points: [
        {
          h: 'Three roles, each with its own space',
          b: 'Separate auth guards and route groups for student, supervisor and admin, so each sees only their part — and a team’s private chat never reaches the supervisor or the admin. All three dashboards work in Arabic and English, and the language follows the user from the site into the dashboard.',
        },
        {
          h: 'Defenses with committees and minutes',
          b: 'A weekly planner suggests a slot and a room for every completed project, committees have several examiners and a chair, and the team leader uploads the presentation beforehand. Afterwards there are printable defense minutes and a final grade combining the committee’s marks with an optional weight for the supervisor’s.',
        },
        {
          h: 'Live without a reload',
          b: 'Notifications and sidebar counts update on their own, and discussion messages arrive, send and delete in place. File uploads show a cancellable progress bar, and every delete or decision asks through one in-app dialog instead of the browser’s confirm().',
        },
        {
          h: 'A demo copy you can try in one click',
          b: 'In demo mode the sign-in page offers "try as student / supervisor / admin" with no account, a guard blocks anything that would spoil the copy for the next visitor, and the data is restored nightly from a snapshot with dates shifted so deadlines stay current.',
        },
      ],
    },
  },

  {
    slug: 'kafala',
    // The eight screens the case study actually argues about; the rest of
    // the capture set stays available behind the full gallery.
    tour: ['home', 'orphans', 'orphan', 'transparency', 'checkout', 'portal', 'adm-dash', 'adm-disburse'],
    shots: 'kafala',
    // The transparency page: "we don't ask you to trust us, we ask you to
    // verify" is the whole platform in a sentence; the home page was a hero.
    cover: 'transparency',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Vue 3', 'Sanctum', 'Pest', 'Playwright'],
    repo: 'https://github.com/ahmedalhawajri89/kafala-orphan-sponsorship',
    demo: 'https://kafala-orphan-sponsorship.vercel.app/',
    ar: {
      name: 'كفالة',
      kind: 'منصة كفالة أيتام',
      tagline: 'كل رقم يُنشر مشتقّ من قاعدة البيانات، لا مكتوب في الصفحة.',
      summary:
        'أغلب مواقع التبرّع تطلب منك أن تثق بها. هذه مبنيّة كي لا تحتاج. لا تتبرّع لجهة مجهولة — تكفل طفلاً باسمه وقصّته وملفّه الموثَّق، ويصلك تقرير مصوَّر كل ثلاثة أشهر، وتقرأ الميزانية المدقّقة التي يقرأها أي شخص آخر. وهذا المبدأ مطبَّق في مخطط قاعدة البيانات لا في نصّ تسويقي.',
      points: [
        {
          h: 'قيد فريد جزئي على محرّك لا يملك واحداً',
          b: 'الكافل يجب ألّا يكفل الطفل نفسه مرّتين في الوقت نفسه، لكن يجب أن يبقى حرّاً في العودة بعد الإلغاء. القيد الفريد العادي يمنع العودة، وMySQL لا تدعم الفهارس الجزئية — فبُني القيد بعمود مولَّد يخرج فيه الصف الملغى من القيد تلقائياً.',
        },
        {
          h: 'مفتاح idempotency فريد على المدفوعات',
          b: 'الكافل يضغط «ادفع» مرّتين، أو بوّابة الدفع تعيد إرسال الويبهوك. الشحن المكرّر صار مستحيلاً بالمحرّك نفسه، لا بانضباط في الكود.',
        },
        {
          h: 'تاريخ الميلاد، لا العمر',
          b: 'عمود العمر يصير خاطئاً في اليوم التالي لكتابته. التاريخ هو الحقيقة، والعمر يُشتق منه.',
        },
        {
          h: 'أربع أعين على الصرف',
          b: 'من سجّل عملية الصرف لا يستطيع اعتمادها بنفسه، والسياسة تفحص ذلك في الكود لا في الواجهة. والمعتمَد لا يُعدَّل — يُعكَس بقيد مضاد.',
        },
      ],
    },
    en: {
      name: 'Kafala',
      kind: 'Orphan sponsorship platform',
      tagline: 'Every published number is derived from the database, not typed into the page.',
      summary:
        'Most donation sites ask you to trust them. This one is built so you do not have to. You sponsor a named child with a story and a verified file, you receive a photo report every three months, and you can read the audited budget that anyone else can read too. That principle is enforced in the schema, not written in the marketing copy.',
      points: [
        {
          h: 'A partial unique constraint on an engine that has none',
          b: 'A sponsor must not sponsor the same child twice at the same time, but must be free to come back after cancelling. MySQL has no partial indexes, so the constraint is built with a generated column — cancelled rows drop out of the constraint automatically.',
        },
        {
          h: 'idempotency_key is unique on payments',
          b: 'A sponsor double-clicks "pay", or the gateway retries its webhook. The duplicate charge is made impossible by the engine rather than by code discipline.',
        },
        {
          h: 'date_of_birth, never age',
          b: 'An age column is wrong the day after you write it. The date is the fact; the age is derived.',
        },
        {
          h: 'Four eyes on every disbursement',
          b: 'Whoever recorded a disbursement cannot approve it, and the policy checks that in code, not in the interface. An approved record is never edited — it is reversed with a counter-entry.',
        },
      ],
    },
  },

  {
    slug: 'mawaheb',
    // The eight screens the case study actually argues about; the rest of
    // the capture set stays available behind the full gallery.
    tour: ['home', 'discover', 'search', 'profile', 'opp', 'dash', 'portfolio', 'scout-opps'],
    shots: 'mawaheb',
    cover: 'discover',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Breeze', 'Socialite', 'PHPUnit'],
    repo: 'https://github.com/ahmedalhawajri89/mawaheb-platform',
    ar: {
      name: 'مواهب',
      kind: 'منصة اكتشاف المواهب العربية',
      tagline: 'العربية هي الأصل لا طبقة ترجمة، وبلا أي إطار JavaScript.',
      summary:
        'موسيقيون وفنانون ومصممون وكتّاب ورياضيون ينشرون معرض أعمال حقيقياً، والكشّافون والعلامات التجارية يجدونهم. المنصات العالمية لم تُبنَ للمحتوى العربي: تخطيطات معكوسة، بحث لا يفهم العربية، ولا سياق ثقافياً. مواهب الرهان المعاكس: الواجهة مبنية من اليمين لليسار من أول سطر، والإنجليزية هي الخيار الإضافي.',
      points: [
        {
          h: 'Blade يعرض كل صفحة، ولا إطار JavaScript',
          b: 'صفحات الاكتشاف يجب أن تُفهرَس وتفتح بسرعة على الهاتف، وتطبيق الصفحة الواحدة يخسر في الاثنين. فالمنتج لارافيل يعرض HTML من الخادم، وJavaScript تحسين تدريجي فقط: الثيم والنوافذ والتمرير اللانهائي ورفع الملفات.',
        },
        {
          h: 'ثلاثة أنواع حسابات محروسة في طبقة البيانات',
          b: 'موهبة وكشّاف وعلامة تجارية تُختار عند التسجيل وتُفرَض بالوسطاء والسياسات، لا بإخفاء الأزرار. الحد الأدنى للعمر ١٦ يُتحقّق منه من تاريخ الميلاد على الخادم، ومن هم بين ١٦ و١٧ يمرّون بموافقة وليّ الأمر قبل تفعيل الحساب.',
        },
        {
          h: 'عدّادات تبقى صادقة',
          b: 'عدد المتابعين والطلبات والمشاهدات يُزاد داخل المعاملة نفسها التي تكتب الصف المسبّب، لأن عدّاداً ينحرف أسوأ من لا عدّاد. واكتمال الملف معادلة موزونة، لا تخمين.',
        },
        {
          h: 'حذف يحذف فعلاً',
          b: 'حذف ناعم، ثم فترة سماح مع إشعار بالبريد، ثم تطهير يزيل الصفوف والوسائط المخزّنة معاً. مسار محو حقيقي، لا علامة مخفية.',
        },
      ],
    },
    en: {
      name: 'Mawaheb',
      kind: 'Arabic talent-discovery platform',
      tagline: 'Arabic is the default, not a translation layer — and there is no JavaScript framework.',
      summary:
        'Musicians, artists, designers, writers and athletes publish a real portfolio, and scouts and brands find them. The global platforms were never built for Arabic content: mirrored layouts, search that does not understand the language, no cultural context. Mawaheb is the opposite bet: laid out right-to-left from the first line, with English as the toggle.',
      points: [
        {
          h: 'Blade renders every page; no JavaScript framework',
          b: 'Discovery pages have to be crawlable and open fast on a phone, and a client-side SPA loses on both. So the product is a Laravel monolith rendering server-side HTML, with JavaScript as progressive enhancement only: theme, modals, infinite scroll, upload UX.',
        },
        {
          h: 'Three account types, gated in the data layer',
          b: 'Talent, scout and brand are chosen at registration and enforced by middleware and policies, not by hiding buttons. Minimum age 16 is validated server-side from the birth date; 16–17 must clear guardian consent before the account activates.',
        },
        {
          h: 'Counters that stay honest',
          b: 'Followers, applications and views are incremented inside the same transaction as the row that caused them, because a counter that drifts is worse than no counter. Profile completeness is a weighted formula, not a guess.',
        },
        {
          h: 'Deletion that actually deletes',
          b: 'Soft delete, a grace period with an email notice, then a purge that removes the rows and the stored media. A real erasure path, not a hidden flag.',
        },
      ],
    },
  },
];

export const PROFILE = {
  name: { ar: 'أحمد الحواجري', en: 'Ahmed Al-Hawajiri' },
  role: {
    ar: 'مطوّر Full-Stack وجودة واختبارات — لارافيل وفيو، عربي أولاً',
    en: 'Full-stack developer & QA — Laravel & Vue, Arabic-first',
  },
  location: { ar: 'غزة، فلسطين', en: 'Gaza, Palestine' },
  years: 4,
  lede: {
    ar: 'أبني التطبيق كاملاً وحدي — من تصميم قاعدة البيانات، إلى الواجهة الخلفية بلارافيل، إلى الواجهة الأمامية — فتتعامل مع شخص واحد من أول المشروع إلى آخره.',
    en: 'I build the whole application myself — from the database schema, to the Laravel back end, to the front end — so you deal with one person from the first day to the last.',
  },
  links: {
    github: 'https://github.com/ahmedalhawajri89',
    khamsat: 'https://khamsat.com/user/ahmed12089',
    whatsapp: 'https://wa.me/972599520085',
    email: 'ahmedalhawajri89@gmail.com',
  },
};
