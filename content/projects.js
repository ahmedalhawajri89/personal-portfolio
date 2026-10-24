// Every line here is drawn from the project's own README and source.
// If a claim is not in the repo, it is not in this file.

export const PROJECTS = [
  {
    slug: 'diwan',
    shots: 'diwan',
    // The product page, not the catalogue: its top already carries both
    // verdicts — the room and the way in — which is the idea in one glance.
    cover: 'product',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Tailwind 4', 'Alpine.js', 'Pest', 'Vercel'],
    repo: 'https://github.com/ahmedalhawajri89/diwan-e-commerce',
    demo: 'https://diwan-xi.vercel.app/',
    ar: {
      name: 'ديوان',
      kind: 'متجر أثاث عربي للسوق السعودي',
      tagline: 'يقيس الزبون غرفته وطريقها مرّة، فتُجيبه كل قطعة: هل تتّسع، وهل تصل؟',
      summary:
        'أكثر فئة يفشل فيها الشراء أونلاين هي الأثاث، والسبب بسيط: الكنبة عرضها ٢٤٠ سم والزبون لا يعرف هل ٢٤٠ مناسبة أم لا، فتصل القطعة ولا تدخل من الباب. ديوان ينقل هذا السؤال إلى الواجهة: الزبون يحفظ غرفته بعرضها وطولها، وطريقها من باب البيت إلى المصعد أو الدرج إلى درج الفيلا الداخلي، ومن تلك اللحظة تقول له كل قطعة هل تتّسع لغرفته وهل تصل إليها، ولماذا. وهو مبني للسوق السعودي: أسعار بالريال شاملة ضريبة القيمة المضافة، وفاتورة ضريبية مبسّطة برمز ZATCA، وتوصيل حسب المدينة بموعد يُحجز، وإرجاع يُسجَّل سببه. ولوحة التحكم مفتوحة للتجربة بحساب عرض يرى كل شيء ولا يغيّر شيئاً.',
      points: [
        {
          h: 'حكم «هل تتّسع؟» حسابٌ بقواعد، لا تلميح',
          b: 'القطعة يجب أن تتّسع لأطول جدار، وألّا تأخذ أكثر من ٦٠٪ من الأرضية، وأن يكون أحد أوجهها أقل من ٨٠ سم لتمرّ من الباب. وحين تُكسر أكثر من قاعدة يُقال للزبون أسوأها لا أوّلها. غرفة بلا قياسات جوابها مختلف عن منتج بلا أبعاد، والواجهة تفرّق بينهما.',
        },
        {
          h: 'طريق القطعة لبيتك يُمشى خطوةً خطوة',
          b: 'الباب، ثم المصعد ببابه وعربته، أو الدرج ومنعطفه، ثم درج الفيلا الداخلي. والقطعة تُحمل بالمقاس الذي تصل به: مركّبة أو مفكّكة أو في صناديق. والحساب يميل إلى «لن تمر»: هامش ٢ سم من كل جانب، وأسوأ خطوة هي التي تقرّر وتُسمّى، وخطوة لم تُقَس تبقى «لم تُفحص» لا «تمر». وحين يرفضها المصعد وتمرّ من البلكونة يقول: بالرافعة، لا «لا».',
        },
        {
          h: 'جاهز للسوق السعودي دون ادّعاء',
          b: 'الأسعار شاملة ضريبة القيمة المضافة ١٥٪، والضريبة تُستخرج منها حتى الهللة، وكل طلب يحفظ النسبة التي بيع بها. والفاتورة لا تُسمّى «ضريبية مبسّطة» برمز ZATCA إلا حين يكون للمتجر رقم ضريبي وتتمّ البيعة، وقبل ذلك إيصال يقول السبب. ورسوم التوصيل ومدّة الإرجاع وأيام التوصيل يحدّدها المتجر من لوحته، وما لم يحدّده تقول الواجهة إنه يُتّفق عليه عند التواصل.',
        },
        {
          h: 'المخزون يُحسم في قاعدة البيانات لا في PHP',
          b: 'الشراء يقفل صف المنتج بـ lockForUpdate داخل المعاملة نفسها التي تكتب الطلب، فلا يفوز اثنان بآخر قطعة. وسلّة فيها سطر غير متوفّر تفشل كاملةً: لا يُخصم شيء ولا يبقى طلب ناقص. وإلغاء الطلب يعيد المخزون مرّة واحدة مهما حُفظ الطلب بعدها.',
        },
      ],
    },
    en: {
      name: 'Diwan',
      kind: 'Arabic-first furniture store for the Saudi market',
      tagline: 'The customer measures the room and the way in once, and every piece answers: does it fit, and will it get there?',
      summary:
        'Furniture is where online shopping fails most often, and the reason is dull: a sofa is 240 cm wide and the buyer has no idea whether 240 cm is fine, so the piece arrives and does not clear the door. Diwan moves that question to the front. A customer saves the room with its width and length, and the way to it — the front door, the lift or the stairs, a villa’s own stairs inside — and from then on every piece says whether it fits the room and whether it gets there, and why. It is built for the Saudi market: prices in riyals including VAT, a simplified tax invoice with its ZATCA QR code, delivery by city with a booked day, and returns that record their reason. The admin panel is open to try, through a demo account that sees everything and changes nothing.',
      points: [
        {
          h: 'The fit verdict is arithmetic with a rule set, not a hint',
          b: 'A piece has to fit the longest wall, take no more than 60% of the floor, and have at least one face under 80 cm so it clears a doorway. When more than one rule is broken the customer is told the worst one, not the first checked. A room with no measurements and a product with no dimensions are different answers, and the interface says so.',
        },
        {
          h: 'The way in is walked, step by step',
          b: 'The front door, then the lift’s door and car, or the stairs and their turn, then a villa’s inner stairs. A piece is carried at the size it arrives: assembled, with parts off, or in boxes. The check errs towards “it will not go”: a 2 cm margin a side, the worst step decides and is named, and a step nobody measured stays unchecked rather than passed. When the lift refuses a piece but the balcony clears it, it says: by hoist, not no.',
        },
        {
          h: 'Ready for Saudi Arabia, without pretending',
          b: 'Prices include 15% VAT, the tax is found inside them to the halala, and each order keeps the rate it was sold under. An invoice is called a simplified tax invoice, with its ZATCA QR code, only once the shop has a VAT number and the sale has happened; until then it is a receipt that says why. Delivery fees, the return period and delivery days are the shop’s to set from its panel, and until they are set the storefront says they are agreed on contact.',
        },
        {
          h: 'Stock is decided in the database, not in PHP',
          b: 'Checkout locks the product row with lockForUpdate inside the transaction that writes the order, so two customers reaching for the last piece cannot both succeed. A cart with one unavailable line fails whole. Cancelling returns the stock exactly once.',
        },
      ],
    },
  },

  {
    slug: 'booking',
    shots: 'booking',
    cover: 'board',
    year: '2026',
    stack: ['Vue 3.5', 'Vite 6', 'Tailwind 4', 'Pinia', 'Laravel 12', 'MySQL', 'PHPUnit', 'Vitest', 'Playwright'],
    repo: 'https://github.com/ahmedalhawajri89/waeda-booking',
    demo: 'https://waeda-booking.vercel.app/',
    ar: {
      name: 'وعدة',
      kind: 'منصة حجز مواعيد للمنشآت الخدمية',
      tagline: 'العميل يحجز من جواله بلا حساب، والموعد المحجوز لا يبقى فارغاً.',
      summary:
        'منصة حجز عربية للعيادات والصالونات ومراكز التدريب والخدمات المنزلية والمطاعم والملاعب. لكل منشأة صفحة حجز باسمها، والعميل يحجز برقم جواله دون إنشاء حساب، والمنشأة تدير يومها من لوحة واحدة. والخسارة الحقيقية لهذه المنشآت ليست قلّة الحجز بل الغياب، فمساعد الحضور يذكّر العميل ويطلب تأكيده ويعرض الموعد الملغى على قائمة الانتظار. مبنية كمنتج يعمل لا كواجهة عرض: الأوقات والتعارض والأسعار وساعات العمل تُحسب بقواعد حقيقية، ويفرضها الخادم، وتغطيها اختبارات.',
      points: [
        {
          h: 'الأوقات تُحسب، والقفل داخل المعاملة',
          b: 'الأوقات الحرّة تُولَّد من مدّة الخدمة وفاصلها، والمختص أو المكان المحجوز، ونافذة يوم العمل التي قد تعبر منتصف الليل، والفترات الخاصة وأوقات الصلاة. والـ API يقفل صف المورد ويفحص التداخل داخل المعاملة التي تكتب الحجز، فمن مشغّلَين يؤكّدان الموعد نفسه في الثانية نفسها يخسر الثاني دائماً، واختبار بجلستين حقيقيتين يثبت ذلك.',
        },
        {
          h: 'مساعد الحضور يعمل على الغياب مباشرة',
          b: 'تذكير يطلب الرد بـ ١ للتأكيد أو ٢ للإلغاء أو ٣ للتأجيل، وتقدير لاحتمال الغياب من سجل العميل نفسه مشروح بكلام واضح، وصندوق يتولّى فيه الفريق الردود التي لم يفهمها، وعرض الموعد الملغى على قائمة الانتظار. والردود الحرّة مثل «خليها بكرة بعد المغرب» يقرؤها نموذج لغوي إن وُجد وقوائم كلمات إن لم يوجد، ولا يصل النموذجَ اسمُ العميل ولا جواله.',
        },
        {
          h: 'بلا حساب، والجوال يُثبَت على الخادم',
          b: 'الجوال هو هوية العميل، فرمز التحقق يصدره الخادم ويفحصه هو: خمس محاولات خلال عشر دقائق، ثم رمز يثبت ذلك الرقم لتلك المنشأة تسعين يوماً، فيحجز العائد من الجهاز نفسه بلا رمز. وصفحة إدارة الحجز لا تُفتح إلا برابط سرّي عشوائي يُخزَّن مجزّأً، أو بالرقم كاملاً مع إثباته.',
        },
        {
          h: 'مبنية للمنطقة',
          b: 'دوام يبدأ ١٦:٠٠ وينتهي ٠٢:٠٠ فيكون موعد الواحدة ليلاً من مساء اليوم السابق، وساعات رمضان بتقويم أم القرى، وحجب أوقات الصلاة تلقائياً لعشرين مدينة، وفلتر للمختصات والمختصين. وصفحات العميل تحسب على ساعة المنشأة لا ساعة جهاز الزائر.',
        },
      ],
    },
    en: {
      name: 'Waeda',
      kind: 'Appointment booking for service businesses',
      tagline: 'Customers book from their phone without an account, and a booked time does not go empty.',
      summary:
        'An Arabic-first booking platform for clinics, salons, training centres, home services, restaurants and courts. Each business gets its own booking page, customers book with their phone number and no account, and the business runs its day from one console. What actually costs these businesses is not too few bookings but no-shows, so an appointment guard reminds the customer, asks them to confirm, and offers a cancelled slot to the waitlist. Built as a working product rather than a mockup: availability, conflicts, pricing and opening hours are computed by real rules, enforced on the server and covered by tests.',
      points: [
        {
          h: 'Times are computed, and the lock sits in the transaction',
          b: 'Free times are generated from the service length and buffer, the person or place booked, a business-day window that may cross midnight, special periods and prayer pauses. The API locks the resource row and tests for an overlap inside the transaction that writes the booking, so of two operators confirming the same slot in the same second the second one always loses, and a test with two live connections proves it.',
        },
        {
          h: 'An appointment guard that works on no-shows',
          b: 'A reminder that takes 1 to confirm, 2 to cancel or 3 to move; a no-show risk drawn from the customer’s own history and explained in plain words; an inbox where the team answers what it could not read; and a cancelled slot offered to the waitlist. Free-form replies such as «خليها بكرة بعد المغرب» are read by a language model when one is configured and by word lists otherwise, and the model never sees the customer’s name or phone.',
        },
        {
          h: 'No account, and the phone is proven on the server',
          b: 'The phone is the customer’s identity, so the server issues and checks the code: five attempts within ten minutes, then a token that proves that number to that business for 90 days, so a returning guest on the same device books without a code. The manage page opens only with a random secret link stored hashed, or the whole phone number together with its proof.',
        },
        {
          h: 'Built for the region',
          b: 'A day can open at 16:00 and close at 02:00, so the 01:00 booking belongs to the evening before; Ramadan hours dated by the Umm al-Qura calendar; prayer pauses computed for 20 cities; a filter for female or male specialists. And the guest pages run on the business’s clock, not the visitor’s device.',
        },
      ],
    },
  },

  {
    slug: 'takharruj',
    shots: 'grad',
    // The "project journey" home: the whole idea in one picture.
    cover: 'home',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Vanilla JS', 'Yajra DataTables', 'PHPUnit'],
    repo: 'https://github.com/ahmedalhawajri89/Takharruj',
    // Demo mode: one-click sign-in as student, supervisor or admin, reset nightly.
    demo: 'https://takharruj.vercel.app/',
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
    slug: 'lamma',
    shots: 'lamma',
    // The transparency page: "we don't ask you to trust us, we ask you to
    // verify" is the whole platform in a sentence; the home page was a hero.
    cover: 'transparency',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Bootstrap 5', 'Vue 3', 'Sanctum', 'Pest', 'Playwright'],
    repo: 'https://github.com/ahmedalhawajri89/Lamma',
    demo: 'https://lamma-sponsorship.vercel.app/',
    ar: {
      name: 'لمّة',
      kind: 'منصة كفالة أيتام',
      tagline: 'كل رقم يُنشر مشتقّ من قاعدة البيانات، لا مكتوب في الصفحة.',
      summary:
        'أغلب مواقع التبرّع تطلب منك أن تثق بها. هذه مبنيّة كي لا تحتاج. لا تتبرّع لجهة مجهولة، بل تكفل طفلاً باسمه وقصّته وملفّه الموثَّق، ويصلك تقرير مصوَّر كل ثلاثة أشهر، وتقرأ أرقام الإنفاق نفسها التي يقرؤها أي شخص آخر، محسوبة من قاعدة البيانات. وهذا المبدأ مطبَّق في مخطط قاعدة البيانات لا في نصّ تسويقي.',
      points: [
        {
          h: 'قيد فريد جزئي على محرّك لا يملك واحداً',
          b: 'الكافل يجب ألّا يكفل الطفل نفسه مرّتين في الوقت نفسه، لكن يجب أن يبقى حرّاً في العودة بعد الإلغاء. القيد الفريد العادي يمنع العودة، وMySQL لا تدعم الفهارس الجزئية، فبُني القيد بعمود مولَّد يخرج فيه الصف الملغى من القيد تلقائياً.',
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
          b: 'من سجّل عملية الصرف لا يستطيع اعتمادها بنفسه، والسياسة تفحص ذلك في الكود لا في الواجهة. والمعتمَد لا يُعدَّل، بل يُعكَس بقيد مضاد.',
        },
      ],
    },
    en: {
      name: 'Lamma',
      kind: 'Orphan sponsorship platform',
      tagline: 'Every published number is derived from the database, not typed into the page.',
      summary:
        'Most donation sites ask you to trust them. This one is built so you do not have to. You sponsor a named child with a story and a verified file, you receive a photo report every three months, and you can read the same spending figures as anyone else, computed from the database. That principle is enforced in the schema, not written in the marketing copy.',
      points: [
        {
          h: 'A partial unique constraint on an engine that has none',
          b: 'A sponsor must not sponsor the same child twice at the same time, but must be free to come back after cancelling. MySQL has no partial indexes, so the constraint is built with a generated column, so cancelled rows drop out of the constraint automatically.',
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
          b: 'Whoever recorded a disbursement cannot approve it, and the policy checks that in code, not in the interface. An approved record is never edited; it is reversed with a counter-entry.',
        },
      ],
    },
  },

  {
    slug: 'mawaheb',
    shots: 'mawaheb',
    cover: 'discover',
    year: '2026',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Breeze', 'PHPUnit'],
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
          b: 'موهبة وكشّاف وعلامة تجارية تُختار عند التسجيل وتُفرَض بالوسطاء والسياسات، لا بإخفاء الأزرار. الحد الأدنى للعمر ١٦ يُتحقّق منه من تاريخ الميلاد على الخادم، فلا يُفتح حساب لمن هو أصغر.',
        },
        {
          h: 'عدّادات تبقى صادقة',
          b: 'عدد الطلبات يُزاد داخل المعاملة نفسها التي تكتب الطلب، والمشاهدة لا تُعدّ إلا حين يُكتب صفّها فعلاً، لأن عدّاداً ينحرف أسوأ من لا عدّاد. واكتمال الملف معادلة موزونة، لا تخمين.',
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
          b: 'Talent, scout and brand are chosen at registration and enforced by middleware and policies, not by hiding buttons. Minimum age 16 is validated server-side from the birth date, so no younger account can be opened.',
        },
        {
          h: 'Counters that stay honest',
          b: 'The application count is incremented inside the same transaction that writes the application, and a view is counted only when its row is actually written, because a counter that drifts is worse than no counter. Profile completeness is a weighted formula, not a guess.',
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
    ar: 'من قاعدة البيانات إلى آخر زرّ على الشاشة، أعمل على المشروع كلّه بنفسي. يعني ذلك أنك تتحدث مع الشخص نفسه الذي يكتب الكود، من أول يوم إلى يوم التسليم.',
    en: 'From the database to the last button on the screen, I work on the whole project myself. You talk to the person writing the code, from the first day to the day it ships.',
  },
  links: {
    github: 'https://github.com/ahmedalhawajri89',
    khamsat: 'https://khamsat.com/user/ahmed12089',
    whatsapp: 'https://wa.me/972599520085',
    email: 'ahmedalhawajri89@gmail.com',
  },
};
