// The case study as a client reads it: who the product is for, what was wrong
// before it, the product walked once through its real screens, and what was
// handed over. content/stories.js keeps the engineering; this file keeps the
// plain language. Same rule as the rest of content/: every sentence is backed
// by the project's own README, docs or source, and each figure says where it
// was counted. `journey[].shot` is a page key from content/shots/<folder>.json.

export const BRIEFS = {
  diwan: {
    // tests/: 510 it()/test() definitions (pest lists 524 cases once data sets expand)
    tests: 510,
    journey: [
      {
        shot: 'catalogue',
        ar: { h: 'قِس غرفتك مرّة', b: 'يحفظ الزبون عرض غرفته وطولها مرّة واحدة، فتظهر على كل قطعة في المجموعة كلمة واحدة: تتّسع، أو ضيّقة، أو لا تتّسع.' },
        en: { h: 'Measure once', b: 'The customer saves the room’s width and length once, and every piece in the catalogue shows one word: fits, tight, or will not fit.' },
      },
      {
        shot: 'product',
        ar: { h: 'الحكم وسببه', b: 'صفحة القطعة تقول هل تتّسع ولماذا، مع رسم بالمقياس بجانب شخص طوله ١٧٥ سم، فيرى الزبون الحجم بدل أن يتخيّله.' },
        en: { h: 'The verdict and the reason', b: 'The product page says whether it fits and why, with a scale drawing beside a 175 cm person, so the size is seen rather than imagined.' },
      },
      {
        shot: 'way-in',
        ar: { h: 'طريقها إلى بيتك', b: 'يضيف الزبون الباب والمصعد أو الدرج والبلكونة، فتقول القطعة هل تصل، وأين ستعلق، أو أنها تحتاج رافعة.' },
        en: { h: 'The way in', b: 'The customer adds the door, the lift or stairs and the balcony, and the piece says whether it gets there, where it would stick, or that it needs a hoist.' },
      },
      {
        shot: 'checkout',
        ar: { h: 'مدينة ورسوم وموعد', b: 'يختار مدينته فتُضاف رسوم توصيلها فوراً، ويحجز يوم التوصيل وفترته صباحاً أو مساءً، والدفع عند الاستلام.' },
        en: { h: 'City, fee, day', b: 'Choosing a city adds its delivery fee at once, and the customer books a delivery day, morning or evening. Payment is cash on delivery.' },
      },
      {
        shot: 'invoice',
        ar: { h: 'فاتورة نظامية', b: 'بعد التسليم تصدر فاتورة ضريبية مبسّطة برمز ZATCA، ومن صفحة الطلب يُطلب الإرجاع مع سببه، ويُسأل الزبون مرّة: هل دخلت القطعة؟' },
        en: { h: 'A proper invoice', b: 'After delivery a simplified tax invoice with its ZATCA QR code is issued, returns are asked for with a reason, and the customer is asked once: did it get in?' },
      },
      {
        shot: 'adm-order',
        ar: { h: 'جهة المتجر', b: 'يرى الفريق سجلّ الطلب وطريق القطعة إلى بيت الزبون قبل أن تخرج السيارة، فيعرف السائق ما ينتظره.' },
        en: { h: 'The shop’s side', b: 'The team sees the order’s history and the customer’s way in before the van leaves, so the crew knows what is waiting for them.' },
      },
    ],
    ar: {
      hook: 'كل قطعة تخبر الزبون قبل الشراء: هل تتّسع لغرفته، وهل تمرّ من بابه؟',
      who: [
        'الزبون الذي يؤثّث بيته في السعودية ويريد أن يعرف قبل الدفع هل تتّسع القطعة وهل تصل.',
        'صاحب المتجر وفريقه: يضيفون القطع بأبعادها الحقيقية، ويحدّدون مدن التوصيل والإرجاع، ويديرون الطلبات من لوحة واحدة.',
        'من يوصّل الطلب: يجد طريق القطعة إلى البيت مكتوباً على الطلب.',
      ],
      problem: 'الأثاث أكثر ما يفشل شراؤه على الإنترنت: رقم بالسنتيمتر لا يعني شيئاً لغرفة الزبون، فتصل القطعة ولا تدخل من الباب.',
      does: 'يحفظ الزبون غرفته وطريقها مرّة، فتعطيه كل قطعة حكماً على بيته هو، داخل متجر جاهز للسوق السعودي بالريال والضريبة وفاتورة ZATCA.',
      delivered: [
        'متجر حيّ، ولوحة إدارة مفتوحة بحساب عرض يرى كل شيء ولا يغيّر شيئاً.',
        'بالعربية والإنجليزية، لكل صفحة رابطان، والعربية هي الافتراضية.',
        '٥١٠ اختبارات آلية تعمل مع كل رفع للكود، ولا يُنشر الموقع إلا إذا نجحت.',
        'فاتورة ZATCA بمرحلتها الأولى (رمز QR)، والمرحلة الثانية مذكورة بصراحة على أنها لم تُنجز.',
      ],
      context: 'في متاجر الأثاث على الإنترنت يرى الزبون صورة على خلفية بيضاء ورقماً بالسنتيمتر لا يعرف ماذا يعني لغرفته. يطلب الكنبة، فتصل ولا تدخل من الباب، أو تعلق في المصعد أو عند منعطف الدرج.',
      pains: [
        { h: 'الرقم وحده لا يكفي', b: 'لا أحد يتخيّل ٢٤٠ سم داخل غرفته.' },
        { h: 'الغرفة ليست كل شيء', b: 'أن تتّسع للغرفة لا يعني أن تصل إليها: الباب والمصعد والدرج يقرّرون أيضاً.' },
        { h: 'وعود لم يقرّرها أحد', b: 'متاجر تَعِد برسوم وموعد وفاتورة ضريبية قبل أن تعرفها.' },
      ],
    },
    en: {
      hook: 'Every piece tells the buyer, before they pay, if it fits the room and gets through the door.',
      who: [
        'The shopper furnishing a home in Saudi Arabia who wants to know, before paying, whether a piece fits and whether it gets there.',
        'The shop owner and team: they add pieces with real dimensions, set delivery cities and returns, and run orders from one panel.',
        'Whoever delivers: the way into the home is written on the order.',
      ],
      problem: 'Furniture is where buying online fails most: a centimetre figure means nothing for the buyer’s room, so the piece arrives and does not clear the door.',
      does: 'The customer saves the room and the way in once, and every piece gives a verdict against that home, inside a shop ready for Saudi Arabia: riyals, VAT and a ZATCA invoice.',
      delivered: [
        'A live shop, with the admin panel open through a demo account that sees everything and saves nothing.',
        'Arabic and English, every page at two addresses, Arabic by default.',
        '510 automated tests run on every push, and the site deploys only once they pass.',
        'The phase-one ZATCA invoice (QR code); phase two is stated plainly as not done.',
      ],
      context: 'In online furniture stores the buyer sees a photo on white and a centimetre figure that means nothing for their room. The sofa is ordered, arrives, and does not go through the door, or sticks in the lift or at the turn of the stairs.',
      pains: [
        { h: 'A number is not enough', b: 'Nobody can picture 240 cm in their own room.' },
        { h: 'The room is not everything', b: 'Fitting the room is not getting there: the door, the lift and the stairs decide too.' },
        { h: 'Promises nobody made', b: 'Shops promise a fee, a day and a tax invoice before they know them.' },
      ],
    },
  },

  booking: {
    // api/tests: 217 PHPUnit methods; `npx vitest list`: 197
    tests: 414,
    journey: [
      {
        shot: 'register',
        ar: { h: 'صفحة المنشأة', b: 'تختار المنشأة قطاعها من ستة قطاعات جاهزة، فتُبنى صفحة الحجز الخاصة بها أمامها.' },
        en: { h: 'Your booking page', b: 'The business picks one of six ready sectors, and its own booking page builds itself.' },
      },
      {
        shot: 'book',
        ar: { h: 'الحجز من الجوال', b: 'يختار العميل الخدمة والمختص واليوم والوقت، ويؤكّد برقم جواله دون إنشاء حساب.' },
        en: { h: 'Book from the phone', b: 'The customer picks a service, a person, a day and a time, and confirms with a phone number, no account.' },
      },
      {
        shot: 'board',
        ar: { h: 'اليوم على لوحة واحدة', b: 'عمود لكل مختص، وخط يشير إلى الآن، وقائمة بما يحتاج تصرّفاً، ونقل الموعد بالسحب.' },
        en: { h: 'The day on one board', b: 'One column per person, a live line for now, a queue of what needs action, and drag to move a booking.' },
      },
      {
        shot: 'guard',
        ar: { h: 'مساعد الحضور', b: 'يذكّر العميل فيردّ ١ للتأكيد أو ٢ للإلغاء أو ٣ للتأجيل، والموعد الملغى يُعرض على قائمة الانتظار.' },
        en: { h: 'The appointment guard', b: 'The customer replies 1 to confirm, 2 to cancel or 3 to move, and a cancelled slot is offered to the waitlist.' },
      },
      {
        shot: 'bookings',
        ar: { h: 'الحجوزات والعملاء', b: 'جداول تُفرز وتُصفّى، وسجلّ كل عميل ونسبة غيابه.' },
        en: { h: 'Bookings and customers', b: 'Tables that sort and filter, and each customer’s history and no-show rate.' },
      },
      {
        shot: 'analytics',
        ar: { h: 'الشهر بالأرقام', b: 'الإشغال والإيراد ونسبة الغياب والإلغاء، والطلب موزّعاً على ساعات اليوم.' },
        en: { h: 'The month in numbers', b: 'Occupancy, revenue, no-show and cancellation rates, and demand across the hours of the day.' },
      },
    ],
    ar: {
      hook: 'يحجز العميل من جواله بلا حساب، ومساعد الحضور يمنع الموعد من أن يبقى فارغاً.',
      who: [
        'صاحب المنشأة: عيادة أو صالون أو مركز تدريب أو خدمة منزلية أو مطعم أو ملعب.',
        'فريق الاستقبال: ينقل المواعيد بالسحب، ويضيف الحجوزات، ويردّ على ما لم يفهمه مساعد الحضور.',
        'العميل: يحجز برقم جواله دون حساب، ويعدّل موعده أو يلغيه لاحقاً.',
      ],
      problem: 'خسارة المنشأة الحقيقية ليست قلّة الحجوزات بل الغياب: موعد محجوز يبقى فارغاً لأن العميل لم يأتِ.',
      does: 'صفحة حجز لكل منشأة، ولوحة تدير اليوم كله، ومساعد حضور يذكّر العميل ويطلب تأكيده ويعطي الموعد الملغى لمن ينتظر.',
      delivered: [
        'تجربة حيّة بلا تسجيل، وزرّ يدخل لوحة التحكم بحساب تجريبي.',
        '٢١٧ اختبار PHPUnit على قاعدة MySQL حقيقية، و١٩٧ اختبار Vitest، وجولة Playwright على كل شاشة.',
        'ستة قطاعات جاهزة، وحجب أوقات الصلاة لعشرين مدينة، وساعات رمضان بتقويم أم القرى.',
        'باقات مجانية وأساسية واحترافية مع تجربة ١٤ يوماً.',
      ],
      context: 'الخسارة الحقيقية لعيادة أو صالون ليست قلّة الحجوزات، بل الموعد الذي يُحجز ثم يبقى فارغاً لأن العميل لم يأتِ. والعميل لا يريد إنشاء حساب ليحجز موعداً واحداً، ويوم العمل في المنطقة له قواعده: دوام بعد منتصف الليل، وساعات رمضان، وأوقات الصلاة.',
      pains: [
        { h: 'وقت مدفوع يضيع', b: 'الغياب يترك الموعد فارغاً بلا تعويض.' },
        { h: 'حجزان للوقت نفسه', b: 'حين يؤكّد شخصان الموعد نفسه في اللحظة نفسها.' },
        { h: 'أدوات لا تعرف المنطقة', b: 'لا دوام يعبر منتصف الليل، ولا رمضان، ولا أوقات الصلاة.' },
      ],
    },
    en: {
      hook: 'Customers book from their phone with no account, and an appointment guard keeps booked times from going empty.',
      who: [
        'The business: a clinic, salon, training centre, home service, restaurant or court.',
        'The front desk: they drag bookings to new times, add bookings, and answer the replies the guard could not read.',
        'The customer: books with a phone number and no account, and can move or cancel later.',
      ],
      problem: 'The real loss for a business is not too few bookings but no-shows: a booked time left empty because the customer did not come.',
      does: 'A booking page per business, a console that runs the whole day, and an appointment guard that reminds, asks for confirmation and gives a cancelled slot to whoever is waiting.',
      delivered: [
        'A live demo with no sign-up, and one button into the console with a demo account.',
        '217 PHPUnit tests on a real MySQL database, 197 Vitest tests, and a Playwright walk through every screen.',
        'Six ready sectors, prayer pauses for 20 cities, Ramadan hours dated by Umm al-Qura.',
        'Free, Basic and Pro plans with a 14-day trial.',
      ],
      context: 'For a clinic or a salon the real loss is not too few bookings but the booked time left empty when the customer does not show. Customers do not want an account just to book one appointment, and a working day in the region has its own rules: hours past midnight, Ramadan hours, prayer times.',
      pains: [
        { h: 'Paid time wasted', b: 'A no-show leaves the slot empty, with nothing to make up for it.' },
        { h: 'Two bookings, one time', b: 'When two people confirm the same slot in the same second.' },
        { h: 'Tools that do not know the region', b: 'No hours past midnight, no Ramadan, no prayer times.' },
      ],
    },
  },

  takharruj: {
    // README; `php artisan test --list-tests`: 481
    tests: 481,
    journey: [
      {
        shot: 'sup-requests',
        ar: { h: 'الفكرة والموافقة', b: 'يقترح الفريق مشروعه أو يختاره من قائمة القسم، والمشرف يقبل أو يرفض أو يطلب تعديلاً.' },
        en: { h: 'Idea and approval', b: 'The team proposes a project or picks one from the department’s list, and the supervisor accepts, rejects or asks for changes.' },
      },
      {
        shot: 'stu-dash',
        ar: { h: 'أين وصل مشروعي', b: 'يرى الطالب فريقه واقفاً عند مرحلته على مسار المشروع، وما المطلوب منه بعدها.' },
        en: { h: 'Where my project stands', b: 'The student sees the team standing at its current step on the project path, and what comes next.' },
      },
      {
        shot: 'sup-project',
        ar: { h: 'المراحل والتسليمات', b: 'صفحة واحدة لكل مشروع: نسبة الإنجاز، وخطة المراحل بمواعيدها، والملفات المسلّمة في كل مرحلة.' },
        en: { h: 'Milestones and submissions', b: 'One screen per project: how far along it is, the milestone plan with deadlines, and the files submitted at each step.' },
      },
      {
        shot: 'sup-discussion',
        ar: { h: 'النقاش في مكانه', b: 'الرسائل بين الفريق والمشرف تصل وتُرسل دون إعادة تحميل، بدل مجموعات واتساب وسلاسل البريد.' },
        en: { h: 'The conversation in one place', b: 'Messages between the team and the supervisor arrive and send without a reload, instead of WhatsApp groups and email threads.' },
      },
      {
        shot: 'defenses',
        ar: { h: 'المناقشات', b: 'يقترح المخطِّط موعداً وقاعة وممتحناً لكل مشروع مكتمل، أو يجدول القائمة كلها بنقرة.' },
        en: { h: 'Defenses', b: 'The planner suggests a slot, a room and an examiner for every completed project, or schedules the whole list in one click.' },
      },
      {
        shot: 'stu-grade',
        ar: { h: 'الدرجة', b: 'تُرصد الدرجة من معدّل اللجنة وتُقفل، ويرى الطالب لحظة تخرّجه.' },
        en: { h: 'The grade', b: 'The grade is the committee’s average, it locks once recorded, and the student gets a graduation moment.' },
      },
    ],
    ar: {
      hook: 'مشروع التخرّج من الفكرة حتى الدرجة، في مكان واحد للطالب والمشرف والقسم.',
      who: [
        'الطالب وفريقه: يقترحون المشروع، ويتابعون مراحله، ويرفعون ملفاتهم، ويرون موعد المناقشة ثم الدرجة.',
        'المشرف: يقبل طلبات الإشراف، ويضع خطة المراحل، ويراجع التسليمات، ويجلس في لجان المناقشة.',
        'إدارة القسم: تنظّم الفصل، وتستورد الطلبة من إكسل، وتجدول المناقشات، وتراجع سجلّ التدقيق.',
      ],
      problem: 'المعلومة موزّعة على إكسل وواتساب والبريد، فلا أحد يعرف بسرعة أي المجموعات بلا مشرف، وأي المراحل تأخّرت، ومن غيّر الدرجة.',
      does: 'منصة واحدة بثلاث مساحات منفصلة، تمشي بالمشروع من الاقتراح إلى المراحل والتسليمات والمناقشة والدرجة، بالعربية والإنجليزية.',
      delivered: [
        'تجربة حيّة بلا حساب: «جرّب كطالب أو مشرف أو مسؤول»، والبيانات تعود كل ليلة.',
        '٤٨١ اختباراً آلياً في ٦٥ ملفاً.',
        'بالعربية والإنجليزية، والعربية أولاً من اليمين لليسار.',
        'استيراد الطلبة من إكسل وتصديرهم، ومحضر مناقشة جاهز للطباعة.',
      ],
      context: 'تُدار مشاريع التخرّج عادةً بجداول إكسل ومجموعات واتساب وسلاسل بريد. فلا أحد يعرف بسرعة أي المجموعات بلا مشرف، وأي المراحل تأخّرت، وأين آخر نسخة من الفصل، ومن غيّر الدرجة ومتى.',
      pains: [
        { h: 'لا جواب واحد', b: 'المعلومة موزّعة على أماكن كثيرة.' },
        { h: 'جدولة على الورق', b: 'عشرات المناقشات على القاعات واللجان تُرتَّب يدوياً.' },
        { h: 'درجة بلا سجلّ', b: 'الدرجة تحتاج أثراً واضحاً لا يُعدَّل بصمت.' },
      ],
    },
    en: {
      hook: 'A graduation project from first idea to final grade, in one place for the student, the supervisor and the department.',
      who: [
        'The student and team: they propose the project, follow its milestones, upload files, and see the defense date and then the grade.',
        'The supervisor: accepts supervision requests, sets the milestone plan, reviews submissions and sits on defense committees.',
        'The department: runs the term, imports students from Excel, schedules defenses and reviews the audit log.',
      ],
      problem: 'The information lives in spreadsheets, WhatsApp and email, so nobody can quickly say which groups have no supervisor, which milestones are late, or who changed a grade.',
      does: 'One platform with three separate spaces that walks a project from proposal through milestones, submissions and the defense to the grade, in Arabic and English.',
      delivered: [
        'A live demo with no account: try as student, supervisor or admin, with the data reset nightly.',
        '481 automated tests across 65 files.',
        'Arabic and English, Arabic first and right to left.',
        'Student import and export through Excel, and printable defense minutes.',
      ],
      context: 'Graduation projects are usually run on spreadsheets, WhatsApp groups and email threads. Nobody can quickly say which groups have no supervisor, which milestones are late, where the latest version of a chapter is, or who changed a grade and when.',
      pains: [
        { h: 'No single answer', b: 'The information is spread across many places.' },
        { h: 'Scheduling on paper', b: 'Dozens of defenses fitted around rooms and committees by hand.' },
        { h: 'A grade with no record', b: 'A grade needs a clear trail that cannot be quietly edited.' },
      ],
    },
  },

  lamma: {
    // README: 331 Pest (`pest --list-tests` agrees) and 53 Playwright
    tests: 384,
    journey: [
      {
        shot: 'orphans',
        ar: { h: 'تعرّف على الأطفال', b: 'أطفال زارهم مشرفون في بيوتهم، تُصفّيهم بالبرنامج والعمر والدولة والحالات العاجلة.' },
        en: { h: 'Meet the children', b: 'Children whom supervisors have visited at home, filtered by programme, age, country and urgent cases.' },
      },
      {
        shot: 'orphan',
        ar: { h: 'ملف الطفل', b: 'اسم وقصّة وملف موثّق، لا تبرّع لجهة مجهولة.' },
        en: { h: 'The child’s file', b: 'A name, a story and a verified file, not a donation to an anonymous cause.' },
      },
      {
        shot: 'checkout',
        ar: { h: 'الكفالة بمبلغك', b: 'يختار الكافل المبلغ كاملاً أو جزءاً منه، ويدفع شهرياً أو كل ثلاثة أشهر أو سنوياً، ويرى قبل الدفع أن لا رسوم للمنصة.' },
        en: { h: 'Sponsor at your amount', b: 'The sponsor covers the whole amount or part of it, pays monthly, quarterly or yearly, and sees before paying that the platform takes no fee.' },
      },
      {
        shot: 'portal',
        ar: { h: 'بوابة الكافل', b: 'أطفاله ومدفوعاته، وآخر تقرير ميداني بتوزيع الإنفاق على التعليم والصحة والغذاء.' },
        en: { h: 'The sponsor portal', b: 'Their children and payments, and the latest field report with spending split across education, health and food.' },
      },
      {
        shot: 'transparency',
        ar: { h: 'الشفافية للجميع', b: 'أرقام الإنفاق محسوبة من الدفعات والصرف الفعلي في قاعدة البيانات، لا مكتوبة في الصفحة.' },
        en: { h: 'Transparency for everyone', b: 'The spending figures are computed from real payments and disbursements in the database, not typed into the page.' },
      },
      {
        shot: 'adm-disburse',
        ar: { h: 'شخصان على كل صرف', b: 'من يسجّل الصرف في لوحة الإدارة لا يستطيع اعتماده بنفسه.' },
        en: { h: 'Two people on every payout', b: 'Whoever records a disbursement in the admin panel cannot approve it.' },
      },
    ],
    ar: {
      hook: 'اكفل طفلاً باسمه في كنف أسرته، وتابع أين ذهب مالك.',
      who: [
        'الكافل: يختار طفلاً باسمه، ويدفع بانتظام، ويتابع تقاريره وأين ذهب ماله.',
        'الزائر: يتصفّح الأطفال والبرامج ويقرأ صفحة الشفافية قبل أن يقرّر.',
        'فريق الجمعية: مدير يرى كل شيء، ومحاسب يدير التحويلات، ومشرف ميداني يرى أسر بلده وحدها.',
      ],
      problem: 'معظم مواقع التبرّع تطلب منك أن تثق بها: تتبرّع لجهة مجهولة، ولا ترى ما وصل وما صُرف.',
      does: 'تكفل طفلاً معروفاً عبر جمعية محلية موثّقة، وتصلك تقارير ميدانية، وكل رقم منشور محسوب من قاعدة البيانات.',
      delivered: [
        'موقع حيّ بحسابات تجريبية لأربعة أدوار، والدفع تجريبي لا يتحرّك فيه مال.',
        'العربية أولاً والإنجليزية كاملة، وأكثر من ألف نصّ مترجم يحرسه اختبار.',
        '٣٣١ اختبار Pest و٥٣ اختبار متصفّح Playwright.',
        'لوحة إدارة من ٢٣ شاشة، ولكل دور ما يخصّه فقط.',
      ],
      context: 'معظم مواقع التبرّع تطلب منك أن تثق بها: تتبرّع لجهة مجهولة، ولا تعرف ما وصل وما اقتُطع وما صُرف. لمّة مبنية كي لا تحتاج إلى هذه الثقة: تكفل طفلاً يعيش مع أسرته عبر جمعية محلية موثّقة، وترى مالك بنداً بنداً.',
      pains: [
        { h: 'أرقام تسويقية', b: 'نسبة مكتوبة في الصفحة لا يستطيع أحد التحقّق منها.' },
        { h: 'تبرّع بلا وجه', b: 'لا يعرف المتبرّع لمن ذهب ماله.' },
        { h: 'خصم مكرّر', b: 'ضغطة «ادفع» مرّتين أو إشعار يُعاد إرساله قد يخصم المبلغ مرّتين.' },
      ],
    },
    en: {
      hook: 'Sponsor a named child within their own family, and see where your money went.',
      who: [
        'The sponsor: chooses a named child, pays regularly, and follows the reports and where the money went.',
        'The visitor: browses children and programmes and reads the transparency page before deciding.',
        'The association’s staff: an administrator who sees everything, an accountant who runs transfers, and a field supervisor who sees only their own country’s families.',
      ],
      problem: 'Most donation sites ask you to trust them: you give to an anonymous cause and never see what arrived and what was spent.',
      does: 'You sponsor a known child through a verified local association, field reports come to you, and every published figure is computed from the database.',
      delivered: [
        'A live site with demo accounts for four roles, on a demo payment gateway where no money moves.',
        'Arabic first and full English, with over a thousand translated strings guarded by a test.',
        '331 Pest tests and 53 Playwright browser tests.',
        'A 23-screen admin console, each role seeing only its own part.',
      ],
      context: 'Most donation sites ask you to trust them: you give to an anonymous cause and never see what arrived, what was kept and what was spent. Lamma is built so you do not need that trust: you sponsor a child who lives with their family, through a verified local association, and you see your money item by item.',
      pains: [
        { h: 'Marketing figures', b: 'A percentage typed into the page that nobody can check.' },
        { h: 'Giving without a face', b: 'The donor never learns where the money went.' },
        { h: 'Double charges', b: 'A double tap on Pay, or a webhook sent twice, can charge twice.' },
      ],
    },
  },

  mawaheb: {
    // `php artisan test --list-tests`: 206
    tests: 206,
    journey: [
      {
        shot: 'discover',
        ar: { h: 'اكتشف', b: 'المواهب مرتّبة حسب المجال، والأكثر متابعة أولاً.' },
        en: { h: 'Discover', b: 'Talent arranged by field, the most followed first.' },
      },
      {
        shot: 'search',
        ar: { h: 'ابحث', b: 'مربّع بحث واحد يغطّي المواهب والفرص معاً.' },
        en: { h: 'Search', b: 'One search box across talent and opportunities together.' },
      },
      {
        shot: 'profile',
        ar: { h: 'ملف الموهبة', b: 'معرض أعمال حقيقي يمكن متابعته أو حفظه.' },
        en: { h: 'The talent’s profile', b: 'A real portfolio you can follow or save.' },
      },
      {
        shot: 'scout-new',
        ar: { h: 'انشر فرصة', b: 'ينشر الكشّاف فرصة، ويمكنه حفظها مسودّة قبل أن تظهر للناس.' },
        en: { h: 'Post an opportunity', b: 'The scout posts an opportunity, and can keep it as a draft before it goes live.' },
      },
      {
        shot: 'opp',
        ar: { h: 'تقدّم', b: 'تتقدّم الموهبة مرّة واحدة لكل فرصة، مع أعمال تختارها من معرضها.' },
        en: { h: 'Apply', b: 'The talent applies once per opportunity, with pieces chosen from the portfolio.' },
      },
      {
        shot: 'dash',
        ar: { h: 'لوحة الموهبة', b: 'المشاهدات والمتابعون والطلبات، ونسبة اكتمال الملف وما ينقصه.' },
        en: { h: 'The talent dashboard', b: 'Views, followers and applications, and how complete the profile is and what is missing.' },
      },
    ],
    ar: {
      hook: 'معرض أعمال عربي للمواهب، يجدهم فيه الكشّافون والعلامات التجارية.',
      who: [
        'الموهبة: موسيقي أو فنان أو مصمم أو كاتب أو رياضي، عمره ١٦ عاماً فأكثر، ينشر أعماله ويتقدّم للفرص.',
        'الكشّاف: يبحث عن المواهب ويتابعها ويحفظها، وينشر فرصاً ويراجع المتقدّمين.',
        'العلامة التجارية: نوع حساب ثالث يبحث عن مواهب لأعماله.',
      ],
      problem: 'لا منصة مبنية للمواهب العربية: المنصات العالمية بتخطيط معكوس وبحث لا يفهم العربية.',
      does: 'منصة تبدأ من العربية: ملفات أعمال، وبحث، وفرص يتقدّم لها الموهوبون، بثلاثة أنواع حسابات لكلٍّ صلاحياته.',
      delivered: [
        'العربية هي الأصل والإنجليزية كاملة.',
        '٢٠٦ اختبارات آلية.',
        'ثلاثة أنواع حسابات وثلاث باقات بأسعار بخمس عملات.',
        'حذف الحساب بمهلة ٣٠ يوماً للتراجع، ثم مسح نهائي للبيانات والملفات.',
      ],
      context: 'لا توجد منصة مبنية للمواهب العربية: إنستغرام بلا عمق معرض أعمال، ولينكدإن بعيد عن العمل الإبداعي، وBehance وSoundCloud لم تُعرَّب يوماً، فالتخطيط معكوس والبحث لا يفهم العربية.',
      pains: [
        { h: 'لا مكان يليق', b: 'الموهبة العربية بلا مكان يعرض أعمالها بلغتها.' },
        { h: 'بحث لا يفهم', b: 'الكشّاف لا يجد المواهب بالبحث العربي.' },
        { h: 'فرص متفرّقة', b: 'لا مسار واضح من الإعلان عن الفرصة إلى قبول المتقدّم.' },
      ],
    },
    en: {
      hook: 'An Arabic-first portfolio home for creative talent, where scouts and brands find them.',
      who: [
        'The talent: a musician, artist, designer, writer or athlete aged 16 or over, who publishes work and applies for opportunities.',
        'The scout: searches for, follows and saves talent, posts opportunities and reviews applicants.',
        'The brand: a third account type looking for talent for its work.',
      ],
      problem: 'There is no platform built for Arab creative talent: the global ones mirror their layouts and their search does not understand Arabic.',
      does: 'A platform that starts from Arabic: portfolios, search, and opportunities talent can apply for, with three account types, each with its own permissions.',
      delivered: [
        'Arabic by default, with full English.',
        '206 automated tests.',
        'Three account types and three plans, priced in five currencies.',
        'Account deletion with a 30-day way back, then a purge of the data and files.',
      ],
      context: 'There is no platform built for Arab creative talent. Instagram has no portfolio depth, LinkedIn is far from creative work, and Behance and SoundCloud were never localised: layouts are mirrored and search does not understand Arabic.',
      pains: [
        { h: 'Nowhere fitting', b: 'Arab talent has no proper place to show its work in its own language.' },
        { h: 'Search that does not understand', b: 'Scouts cannot find talent through Arabic search.' },
        { h: 'Scattered opportunities', b: 'No clear path from posting an opportunity to accepting an applicant.' },
      ],
    },
  },
};
