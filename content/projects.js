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
    status: 'independent',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Tailwind 4', 'Alpine.js', 'Pest', 'Claude API', 'Vercel'],
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
        {
          h: 'مساعد يجيب من الكتالوج الحقيقي، لا من خياله',
          b: '«اسأل ديوان» مبنيّ على Claude: يبحث في الكتالوج بأداتين للقراءة فقط، ويقترح حتى أربع قطع، ولا يَعرض منها إلا ما أعادته الأدوات فعلاً، فلا يخترع قطعة ولا سعراً، ويعرف هل تتّسع القطعة لغرفة الزائر وهل تصل إليها. وفي لوحة التحكم يكتب Claude مسودّة وصف المنتج بالعربية والإنجليزية من بياناته وصورته، مقيّداً بما سُجّل فقط. والميزتان تحرسهما اختبارات.',
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
        {
          h: 'An assistant that answers from the real catalogue',
          b: '“Ask Diwan” is built on Claude: it searches the catalogue through two read-only tools, suggests up to four pieces and shows only pieces those tools actually returned, so it cannot invent a product or a price; it knows whether a piece fits the visitor’s room and whether it gets there. In the admin, Claude drafts a product’s description in Arabic and English from its facts and photograph, held to what was recorded. Both are covered by tests.',
        },
      ],
    },
  },

  {
    slug: 'booking',
    shots: 'booking',
    cover: 'board',
    year: '2026',
    status: 'independent',
    stack: ['Laravel 12', 'MySQL', 'Vue 3.5', 'Vite 6', 'Tailwind 4', 'Pinia', 'PHPUnit', 'Vitest', 'Playwright', 'PHP 8.2', 'Sanctum', 'REST API', 'Chart.js'],
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
    slug: 'baydar',
    shots: 'baydar',
    // The owner's dashboard: net profit after every cost, first, against the
    // previous period. The product's whole idea on one screen, in high definition.
    cover: 'dashboard',
    year: '2026',
    // Public repository under a proprietary licence (read and evaluate only),
    // so not labelled open source. Started as "Opsight"; renamed in 2026-11.
    status: 'public',
    stack: ['Next.js 16', 'React 19', 'Tailwind 4', 'GSAP', 'TanStack Query', 'Recharts', 'Laravel 12', 'PHP 8.2', 'Sanctum', 'MySQL / TiDB', 'Claude API', 'Pest', 'Vitest', 'Playwright', 'Larastan'],
    repo: 'https://github.com/ahmedalhawajri89/Baydar',
    // Demo mode: one-click sign-in for each role, restored from a snapshot nightly.
    demo: 'https://baydar-demo.vercel.app/',
    ar: {
      name: 'بيدر',
      kind: 'منصة ربحية للتجّار الإلكترونيين في الخليج',
      tagline: 'متجرك يخبرك كم بعت. بيدر يخبرك هل ربحت.',
      summary:
        'تاجر سلة أو زد يرى مبيعاته في لوحة متجره، لكن ما يقرّر ربحه يقع خارجها: رسوم الدفع وعمولة المنصة والشحن، والإيجار والرواتب، والنقد الذي سيبقى معه، والمنتج الذي سينفد. بيدر يجمع الطلبات من سلة وزد وشوبيفاي وووكومرس وملفات Excel وربط API، ويطرح منها كل تكلفة حتى الربح الحقيقي لكل طلب، ويتوقّع النقد ثلاثة عشر أسبوعاً والمخزون حتى نفاده، ويرسل موجزاً كل صباح. ومساعد «اسأل بيدر» يشرح الأرقام بالعربية ولا يحسب المال بنفسه. لكل دور من أربعة ما يخصّه، وكل شركة معزولة عن غيرها، وللمنتج صفحة عامة وأسعار وباقات يفرضها الخادم.',
      points: [
        {
          h: 'الربح الحقيقي، طلباً بطلب',
          b: 'رسوم الدفع لكل طريقة، ومنها التقسيط بتابي وتمارا، وعمولة القناة وتكلفة الشحن، تُثبَّت على الطلب لحظة حدوثها، فيظهر هامش المساهمة بين مجمل الربح وصافيه، وتغيير النسبة غداً لا يعيد كتابة أرقام اليوم. والمبالغ DECIMAL في قاعدة البيانات ونصوص bcmath في PHP، لا أعداد عشرية تقريبية.',
        },
        {
          h: 'من كل مكان يبيع فيه التاجر',
          b: 'سلة وزد بتفويض OAuth وأحداث موقَّعة، وشوبيفاي وووكومرس كما تُضبط المتاجر فعلاً، وAPI عام بمفاتيح، واستيراد Excel يقرأ أعمدته بالعربية والإنجليزية. والطلب الواحد لا يُسجَّل مرتين مهما وصل من طرق.',
        },
        {
          h: 'ذكاء اصطناعي لا يحسب المال',
          b: '«اسأل بيدر» على Claude يقرأ الأرقام بأدوات ينفّذها الخادم بصلاحيات من سأل، فلا يرى الموظف تكلفة ولو سأل عنها، ويظهر مصدر كل رقم بجانب الجواب. ولكل باقة عدد أسئلتها في الشهر، وسقف للاستهلاك لا يُتجاوز.',
        },
        {
          h: 'أدوار وشركات بلا تسرّب',
          b: 'المالك والمدير والمحلّل والموظف قرابة خمسين صلاحية تفحصها السياسات على الخادم، والحقل الممنوع كالتكلفة والهامش يُحذف من الاستجابة نفسها. وكل استعلام مقيّد بالشركة، واختبار يمرّ على كل مسار في النظام ويتحقّق أن شركة لا تجد شيئاً لأخرى.',
        },
      ],
    },
    en: {
      name: 'Baydar',
      kind: 'Profit platform for Gulf online merchants',
      tagline: 'Your store tells you what you sold. Baydar tells you whether you made money.',
      summary:
        'A merchant on Salla or Zid sees their sales on the store’s dashboard, but what decides their profit lies outside it: payment fees, the platform’s commission and shipping; rent and salaries; the cash they will have; the product about to run out. Baydar gathers orders from Salla, Zid, Shopify, WooCommerce, Excel files and an API, takes every cost off them to reach the real profit on each order, forecasts cash thirteen weeks ahead and stock until it runs out, and sends a brief every morning. Its assistant, Ask Baydar, explains the figures in Arabic and never does the money arithmetic itself. Each of four roles sees only its own part, every company is walled off from the others, and the product has a public page, prices and plans the server enforces.',
      points: [
        {
          h: 'The real profit, order by order',
          b: 'Payment fees per method, instalments through Tabby and Tamara included, channel commission and the carrier’s charge are fixed on the order as they happen, so contribution margin sits between gross and net profit, and changing a rate tomorrow cannot rewrite today. Amounts are DECIMAL in the database and bcmath strings in PHP, never floats.',
        },
        {
          h: 'From everywhere the merchant sells',
          b: 'Salla and Zid through OAuth and signed webhooks, Shopify and WooCommerce as real stores are set up, a public API with keys, and an Excel import that reads its columns in Arabic or English. One order is recorded once, however many ways it arrives.',
        },
        {
          h: 'AI that never does the money arithmetic',
          b: 'Ask Baydar runs on Claude and reads the figures through tools the server executes with the asker’s own permissions, so staff never see a cost even by asking, and every figure in an answer shows its source beside it. Each plan has its questions a month, under a spending ceiling that cannot be passed.',
        },
        {
          h: 'Roles and companies, no leaks',
          b: 'Owner, manager, analyst and staff are some fifty abilities checked by policies on the server, and a field a role may not see, a cost or a margin, is left out of the response itself. Every query is bound to its company, and a test walks every route in the system to check one company can find nothing of another’s.',
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
    status: 'independent',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Vanilla JS', 'Yajra DataTables', 'PHPUnit', 'Laravel Excel', 'Sanctum', 'Next.js 14', 'React 18', 'Tailwind 3'],
    repo: 'https://github.com/ahmedalhawajri89/takharruj',
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
    // The site as a visitor first meets it, captured in high definition
    // (hd in scripts/shots.config.mjs). The transparency page used to be the
    // cover, but it is already a step of the case study's tour, so the page
    // opened on a screen it then showed again.
    cover: 'home',
    year: '2026',
    status: 'independent',
    stack: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Blade', 'Bootstrap 5', 'Vue 3', 'Sanctum', 'Pest', 'Playwright', 'Pinia', 'Tailwind 4', 'Chart.js', 'Vitest', 'Larastan', 'Spatie Permission', 'REST API'],
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
];

export const PROFILE = {
  name: { ar: 'أحمد الحواجري', en: 'Ahmed Al-Hawajri' },
  role: {
    ar: 'مطوّر Laravel وPHP',
    en: 'Laravel & PHP Developer',
  },
  location: { ar: 'غزة، فلسطين', en: 'Gaza, Palestine' },
  lede: {
    ar: 'أبني أنظمة حجز ومتاجر إلكترونية ولوحات تحكم بالعربية والإنجليزية، بـ Laravel وMySQL في الخلفية وVue 3 في الواجهة.',
    en: 'I build booking systems, online stores and admin dashboards in Arabic and English, with Laravel and MySQL on the back end and Vue 3 on the front.',
  },
  links: {
    github: 'https://github.com/ahmedalhawajri89',
    khamsat: 'https://khamsat.com/user/ahmed12089',
    whatsapp: 'https://wa.me/972599520085',
    email: 'ahmedalhawajri89@gmail.com',
  },
};
