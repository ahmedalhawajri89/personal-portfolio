// The case study behind each project: the idea, the problem it answers, how it
// was solved, and the decisions worth explaining. Keyed by project slug.
// Same rule as everywhere else in content/: every sentence is backed by the
// project's own README, design notes or source. Nothing is invented.

export const STORIES = {
  diwan: {
    ar: {
      idea: 'متجر أثاث عربي يجيب عن السؤالين اللذين يهمّان مشتري الأثاث فعلاً: هل تتّسع هذه القطعة لغرفتي، وهل تصل إليها أصلاً؟ الزبون يحفظ أبعاد غرفته وطريقها مرّة واحدة، وكل قطعة بعدها تعطيه حكماً على بيته هو لا رقماً في جدول مواصفات. ومن حوله متجر جاهز للسوق السعودي: ريال وضريبة وفاتورة ZATCA ومدن توصيل وإرجاع.',
      problem: 'الأثاث أكثر فئة يفشل فيها الشراء أونلاين. كل المتاجر تعرض صورة على خلفية بيضاء ورقماً بالسنتيمتر لا يعني شيئاً لأحد، فتبتلع القطعة الغرفة، أو تتّسع لها ثم تعلق في المصعد أو عند منعطف الدرج. والمشكلة الثانية أن المتجر يَعِد بما لا يعرفه: رسوم توصيل وموعد ومدّة إرجاع وفاتورة «ضريبية» لم يقرّرها أحد.',
      solution: [
        { h: 'نظام الملاءمة', b: 'ثلاث قواعد تُحسب على غرفة الزبون: القطعة تتّسع لأطول جدار، ولا تأخذ أكثر من ٦٠٪ من الأرضية، ولها وجه أقل من ٨٠ سم يمرّ من الباب. وحين تُكسر أكثر من قاعدة يُقال له أسوأها لا أوّلها.' },
        { h: 'طريق القطعة لبيتك', b: 'باب البيت، ثم المصعد أو الدرج ومنعطفه، ثم درج الفيلا الداخلي، والقطعة بالمقاس الذي تُحمل به. وأسوأ خطوة هي التي تقرّر وتُسمّى، وما لم يُقَس يبقى «لم يُفحص»، وحين تمرّ من البلكونة وحدها يقول: بالرافعة. والطريق يُحفظ مع الطلب لمن يوصّله، وبعد التسليم يُسأل الزبون مرّة: هل دخلت؟' },
        { h: 'متجر لا يَعِد بما لا يعرفه', b: 'الأسعار شاملة الضريبة ١٥٪ وكل طلب يحفظ نسبته. والفاتورة الضريبية المبسّطة برمز ZATCA لا تصدر إلا برقم ضريبي وبعد البيعة. ورسوم كل مدينة وأيام التوصيل ومدّة الإرجاع يحدّدها المتجر، وما لم يحدّده يُقال إنه يُتّفق عليه عند التواصل.' },
        { h: 'المخزون في قاعدة البيانات', b: 'الشراء يقفل صف المنتج داخل المعاملة التي تكتب الطلب، فلا يفوز اثنان بآخر قطعة. سلّة فيها سطر غير متوفّر تفشل كاملةً، والإلغاء والإرجاع يعيدان المخزون مرّة واحدة فقط.' },
      ],
      extras: [
        { h: 'الإرجاع يقيس الفكرة نفسها', b: 'الزبون يطلب الإرجاع مع سببه ضمن مدّة المتجر، واللوحة توافق أو ترفض ثم تستلم القطع إلى المخزون. والنظرة العامة تعدّ الأسباب، فيظهر بالأرقام هل صار الإرجاع بسبب المقاس قليلاً، وهو ما بُني المتجر لأجله.' },
        { h: 'حساب عرض لا يكسر شيئاً', b: 'دور «مشاهد» يرى لوحة التحكم كاملة، وكل حفظ أو حذف منه يُردّ برسالة، ولا يستطيع تغيير حسابه. لذلك تُطبع بياناته على صفحة الدخول ليجرّبها أي أحد.' },
        { h: 'نظام تصميم تحرسه اختبارات', b: 'قواعد التصميم مكتوبة كاختبارات على قوالب Blade: لا لون خارج ملف الرموز، ولا استعلام داخل قالب، وكل صورة تمرّ عبر مكوّن واحد. القاعدة التي لا يفحصها أحد قاعدة سترجع.' },
        { h: 'عربي أولاً، بعنوانين', b: 'كل صفحة لها رابط /ar وآخر /en، والعربية هي الافتراضية، مع hreflang وخريطة موقع باللغتين، والروابط القديمة تُحوَّل.' },
      ],
    },
    en: {
      idea: 'An Arabic-first furniture store that answers the two questions a furniture buyer really has: will this piece fit my room, and will it even get there? The customer saves the room and the way in once, and every piece after that gives a verdict against that home, not a number in a spec table. Around it, a shop ready for Saudi Arabia: riyals, VAT, a ZATCA invoice, delivery cities and returns.',
      problem: 'Furniture is where online shopping fails most often. Every store shows a photo on white and a centimetre figure that means nothing, so the piece swallows the room, or fits it and then sticks in the lift or at the turn of the stairs. The second problem is a shop promising what it does not know: delivery fees, a delivery day, a return period and a “tax” invoice nobody has decided on.',
      solution: [
        { h: 'The fit system', b: 'Three rules computed against the customer\'s own room: the piece must fit the longest wall, take no more than 60% of the floor, and have one face under 80 cm to clear a doorway. When more than one rule breaks, the customer is told the worst one, not the first checked.' },
        { h: 'The way in', b: 'The front door, then the lift or the stairs and their turn, then a villa\'s inner stairs, with the piece at the size it is carried. The worst step decides and is named, an unmeasured step stays unchecked, and when only the balcony clears it, it says: by hoist. The way in travels with the order for whoever delivers it, and after delivery the customer is asked once: did it get in?' },
        { h: 'A shop that promises only what it knows', b: 'Prices include 15% VAT and each order keeps its rate. The simplified tax invoice with its ZATCA QR code is issued only with a VAT number and after the sale. Each city\'s fee, the delivery days and the return period are the shop\'s to set, and until they are, the storefront says they are agreed on contact.' },
        { h: 'Stock decided in the database', b: 'Checkout locks the product row inside the transaction that writes the order, so two people cannot both get the last piece. A cart with one unavailable line fails whole, and cancelling or receiving a return puts stock back exactly once.' },
      ],
      extras: [
        { h: 'Returns that measure the idea', b: 'A customer asks for a return with a reason, within the shop\'s period; the panel approves or declines, then receives the pieces back into stock. The overview counts the reasons, so the numbers show whether returns for size are actually few, which is what the shop was built for.' },
        { h: 'A demo account that breaks nothing', b: 'A viewer role sees the whole panel; every save or delete it tries is turned back with a message, and it cannot change its own account. That is why its sign-in is printed on the login page for anyone to try.' },
        { h: 'A design system enforced by tests', b: 'The design rules are unit tests over the Blade templates: no colour outside the token file, no query inside a template, every photograph through one component. A rule nobody checks is a rule that comes back.' },
        { h: 'Arabic first, at two addresses', b: 'Every page lives at /ar and /en, Arabic by default, with hreflang twins and a bilingual sitemap; the old addresses redirect.' },
      ],
    },
  },

  booking: {
    ar: {
      idea: 'منصة حجز مواعيد عربية للمنشآت الخدمية: لكل منشأة صفحة حجز باسمها، والعميل يحجز من جواله بلا حساب، والمنشأة تدير يومها من لوحة تحكم واحدة. وفوقها مساعد حضور، لأن الموعد الذي يُحجز ثم يبقى فارغاً هو ما يكلّف هذه المنشآت فعلاً.',
      problem: 'الغياب هو الخسارة الحقيقية لعيادة أو صالون، لا قلّة الحجوزات. وتحته ثلاث مشاكل يقع فيها أغلب أنظمة الحجز: مشغّلان يؤكّدان الموعد نفسه في الثانية نفسها ولا يمنعهما فحص «قبل الكتابة»؛ وصفحة حجز تحسب الأوقات بساعة جهاز الزائر، فزائر في دبي يحجز عيادة في الرياض يُعرض عليه العاشرة فتخرج التاسعة بتوقيت الرياض ويُرفض الحجز؛ وصفحة «حجزي» كانت تفتح الحجز برقمه وآخر أربعة أرقام من الجوال، والأرقام متسلسلة والجوال ليس سراً.',
      solution: [
        { h: 'القفل حيث يهمّ', b: 'الـ API يقفل صف المورد ويفحص التداخل داخل المعاملة التي تكتب الحجز، فالثاني يخسر دائماً. والتداخل بفترات نصف مفتوحة: موعد ينتهي ١٠:٠٠ وآخر يبدأ ١٠:٠٠ لا يتعارضان. واختبار بجلستين متزامنتين حقيقيتين يثبت ذلك بدل تعليق في الكود.' },
        { h: 'ساعة المنشأة لا ساعة الزائر', b: 'المنشأة تحمل منطقتها الزمنية، وصفحات العميل تضع تواريخها على تلك الساعة، فالكود نفسه يحسب ويعرض أوقات المنشأة أينما كان الزائر، والأوقات تصل الخادم بصيغة UTC صريحة.' },
        { h: 'إثبات لا تخمين', b: 'رمز التحقق من الجوال كان يُصنع ويُفحص في المتصفح، فصار يصدره الخادم ويفحصه بحدّ للمحاولات. وإدارة الحجز تحتاج رابطاً سرّياً عشوائياً يُخزَّن مجزّأً، أو الرقم كاملاً مع إثباته، والإلغاء والتأجيل يطلبان الإثبات نفسه.' },
      ],
      extras: [
        { h: 'مساعد يصمد', b: 'قبل أن يحرّر موعداً لم يُرَدّ عليه يعيد قراءة الصف تحت قفل، ويتراجع إن أكّده العميل في الأثناء. وخطأ منشأة واحدة لا يوقف الجولة عن البقية، والنموذج اللغوي له مهلة ثماني ثوانٍ ثم يرجع لقوائم الكلمات.' },
        { h: 'السعر يحدده الخادم', b: 'سعر المدة وسعر الذروة المسائي يحسبهما الخادم، وأي سعر يرسله المتصفح يُتجاهل. والقاعدة مكتوبة في المتصفح والخادم معاً وتُختبر بالحالات نفسها، فالعرض التجريبي والخادم الحقيقي يتفقان.' },
        { h: 'مراجعة كاملة، وكل نتيجة باختبار', b: 'مُرِّر المشروع كله بمراجعة، وكل مشكلة حرجة أو عالية أُثبتت أولاً باختبار يفشل ثم أُصلحت حتى نجح، وبقيت الاختبارات فيه. اليوم ٢١٧ اختبار PHPUnit على MySQL حقيقية، و١٩٧ اختبار Vitest، وجولة Playwright على كل شاشة تفشل عند أي خطأ في الكونسول.' },
      ],
    },
    en: {
      idea: 'An Arabic-first booking platform for service businesses: each business has its own booking page, customers book from their phone without an account, and the business runs its day from one console. On top sits an appointment guard, because a time that is booked and then left empty is what really costs these businesses.',
      problem: 'For a clinic or a salon the real loss is the no-show, not a shortage of bookings. Underneath it sit three problems most booking systems share: two operators confirm the same slot in the same second and a check-before-write stops neither; the booking page computes times on the visitor’s device clock, so a guest in Dubai booking a Riyadh clinic is offered 10:00 that goes out as 09:00 Riyadh and is refused; and the “my booking” page used to open a booking with its reference and the last four digits of a phone, when references are sequential and phones are not secret.',
      solution: [
        { h: 'The lock where it counts', b: 'The API locks the resource row and tests for an overlap inside the transaction that writes the booking, so the second one always loses. Overlap is half-open: a booking ending at 10:00 and one starting at 10:00 do not collide. A test with two live concurrent connections proves it instead of a comment.' },
        { h: 'The business’s clock, not the visitor’s', b: 'The business carries its time zone, and the guest pages put their dates on that clock, so the same code computes and shows the business’s wall-clock times wherever the guest is, and times reach the server as plain UTC.' },
        { h: 'Proof, not a guess', b: 'The phone code used to be made and checked in the browser; the server now issues and checks it, with limits on attempts. Managing a booking takes a random secret link stored hashed, or the whole phone together with its proof, and cancel and reschedule ask for the same.' },
      ],
      extras: [
        { h: 'A guard that holds', b: 'Before releasing a booking nobody answered, it re-reads the row under a lock and gives up if the customer confirmed in the meantime. One business’s error no longer stops the run for the others, and the language model has an eight-second timeout before falling back to word lists.' },
        { h: 'The server sets the price', b: 'Length and evening-peak pricing are computed on the server, and whatever price the browser sends is ignored. The rule exists in both the browser and the API and both are tested against the same cases, so the demo and the real backend agree.' },
        { h: 'A full review, every finding a test', b: 'The whole project went through a review, and every critical or high finding was first proven with a failing test, then fixed until it passed, and the tests stayed. Today: 217 PHPUnit tests on a real MySQL database, 197 Vitest tests, and a Playwright walk through every screen that fails on any console error.' },
      ],
    },
  },

  takharruj: {
    ar: {
      idea: 'منصة تدير مشاريع التخرّج من أول فكرة حتى الدرجة النهائية، بثلاثة أدوار منفصلة: إدارة تنظّم الفصل وتجدول المناقشات، ومشرف يراجع ويتابع ويقيّم، وطالب يقترح ويسلّم ويناقش فريقه. والفكرة نفسها مرسومة: «رحلة المشروع» بشخصيات تمشي على مسار من الفكرة حتى التخرّج، من الصفحة الرئيسية حتى لوحة الطالب.',
      problem: 'مشاريع التخرّج تُدار عادةً بجداول إكسل وسلاسل بريد وأوراق. لا أحد يملك جواباً واحداً على "أي المجموعات بلا مشرف؟" أو "أي المراحل تأخّرت؟" أو "متى المناقشة ومن في لجنتها؟". وحين تكون الدفعة الجديدة ٣٠٠ طالب، فالإدخال اليدوي وحده يستهلك أسبوعاً، وجدولة عشرات المناقشات على القاعات والممتحنين تُحلّ على ورقة.',
      solution: [
        { h: 'ثلاث مساحات لا واحدة', b: 'حرّاس مصادقة ومسارات مستقلة لكل دور، فلا يرى أحد إلا ما يخصّه. والطالب يفتح على بطاقة مشروعه: فريقه الحقيقي واقف عند مرحلته، والمشرف عند موافقته، واللجنة عند المناقشة.' },
        { h: 'المسار كاملاً حتى المحضر', b: 'اقتراح وقبول أو رفض، وخطة مراحل يضعها المشرف مرّة لكل مجموعاته، وتسليمات بملاحظات، ثم مناقشة بلجنة ورئيس ومحضر قابل للطباعة، ودرجة تُعتمد فتُقفل ولا تُفتح إلا بسبب مكتوب في سجلّ التدقيق.' },
        { h: 'حيّ بلا إعادة تحميل', b: 'الإشعارات وأرقام الشريط الجانبي والنقاش تتحدّث وحدها، والرفع بشريط تقدّم يمكن إلغاؤه. والطالب حين تُرصد درجته يرى لحظة تخرّج: فريقه يرمي قبعاته والدرجة تُعدّ.' },
      ],
      extras: [
        { h: 'شخصيات من مصدر واحد', b: 'الطالبة والمشرف والمسؤول واللجنة رموز SVG في ملف واحد، تستعملها الصفحة الرئيسية وصفحة الدخول واللوحات والحالات الفارغة والجولة التعريفية — تعديل شخصية يصل كل مكان.' },
        { h: 'بالعربية والإنجليزية', b: 'كل نصّ في اللوحات مفتاحه عربي وترجمته في ملفات JSON لكل منطقة، واختبار يفشل إن ظهر نصّ بلا ترجمة أو ترجمة فقدت متغيّراً.' },
        { h: 'محميّة باختبارات', b: '٤٨٠ اختباراً تغطّي الأدوار والصلاحيات والمناقشات والتحديث الحيّ ووضع العرض، تعمل على قاعدة اختبار منفصلة داخل معاملات.' },
      ],
    },
    en: {
      idea: 'A platform that runs graduation projects from the first idea to the final grade, with three separate roles: a department that organises the term and schedules defenses, a supervisor who reviews, tracks and grades, and a student who proposes, submits and talks with the team. The idea is drawn too: a "project journey" of characters walking a path from idea to graduation, from the home page to the student dashboard.',
      problem: 'Graduation projects usually live in spreadsheets, email threads and paper. Nobody has one answer to "which groups have no supervisor yet", "which milestones are overdue" or "when is the defense, and who is on the committee". When a new intake is 300 rows, manual entry alone eats a week, and fitting dozens of defenses around rooms and examiners is solved on paper.',
      solution: [
        { h: 'Three spaces, not one', b: 'Independent auth guards and routes per role, so each person sees only their part. Students open on their project card: their real team stands at its current step, with the supervisor at approval and the committee at the defense.' },
        { h: 'The whole path, down to the minutes', b: 'Proposal, accept or reject, a stage plan the supervisor sets once for all their groups, submissions with notes, then a defense with a committee, a chair and printable minutes, and a grade that locks on approval and reopens only with a written reason in the audit log.' },
        { h: 'Live without a reload', b: 'Notifications, sidebar counts and discussions update on their own, and uploads show a cancellable progress bar. When a student’s grade is recorded they get a graduation moment: the team tosses its caps while the grade counts up.' },
      ],
      extras: [
        { h: 'Characters from one source', b: 'The student, supervisor, admin and committee are SVG symbols in one file, used by the home page, the sign-in page, the dashboards, the empty states and the welcome tour — change a character once and it changes everywhere.' },
        { h: 'Arabic and English', b: 'Every dashboard string is keyed by its Arabic text and translated in per-area JSON files, and a test fails if a string appears without a translation or a translation drops a placeholder.' },
        { h: 'Guarded by tests', b: '480 tests cover roles and permissions, defenses, live updates and demo mode, running on a separate test database inside transactions.' },
      ],
    },
  },

  kafala: {
    ar: {
      idea: 'منصة كفالة أيتام مبنية حول فكرة واحدة: الشفافية. لا تبرّع مجهول المصير، بل طفل باسمه وقصته وملفه الموثّق، وتقرير مصوّر كل ثلاثة أشهر، وميزانية مدقّقة منشورة للجميع. موقع عام عربي، وخادم Laravel، ولوحة إدارة Vue، وبوابة للكافل، كلها على أصل واحد.',
      problem: 'مواقع الخير تكتب أرقامها في الواجهة: "٩٣٪ تصل للطفل" جملة تسويقية لا أحد يستطيع التحقق منها. والمشكلة التقنية تحتها أعمق: كيف تمنع كافلاً من كفالة الطفل نفسه مرّتين مع السماح له بالعودة بعد إلغاء، وكيف تجعل الخصم المزدوج مستحيلاً حين يضغط "ادفع" مرتين أو تعيد البوابة إرسال الإشعار؟',
      solution: [
        { h: 'كل رقم مشتقّ من قاعدة البيانات', b: 'حلقة الإنفاق تُجمَّع من صرف معتمَد، ونسبة الوصول ناتج قسمة، وعدد الزيارات الميدانية عدّ حقيقي. لا رقم مكتوب في الواجهة.' },
        { h: 'قيد جزئي على محرّك لا يدعمه', b: 'عمود مولَّد يساوي ١ للكفالات النشطة وNULL لغيرها، وقيد فريد عليه مع الكافل والطفل. MySQL يستثني NULL من القيود الفريدة، فالكفالات الملغاة لا تمنع العودة.' },
        { h: 'أربع أعين على كل صرف', b: 'من سجّل الصرف لا يعتمده، والسياسة تفحص ذلك في الكود لا في الواجهة. والقيد المعتمَد لا يُعدَّل بل يُعكَس بقيد مضاد، ومفتاح idempotency فريد يجعل الخصم المزدوج مستحيلاً في المحرّك.' },
      ],
      extras: [
        { h: 'أصل واحد لكل شيء', b: 'الموقع العام ولوحة الإدارة والـ API على النطاق نفسه، فلا CORS ولا كوكيز عابرة، وسياسة أمن المحتوى في أضيق صورة ممكنة. الجلسة بكوكي HttpOnly لا توكن في localStorage.' },
        { h: 'الموقع العام يعمل بلا خادم', b: 'ملف البيانات بذرة وطبقة ترطيب معاً: قيمه المكتوبة تعمل بلا API، ودالّة ترطيب تستبدلها بما في قاعدة البيانات حين يكون الخادم متاحاً. لو سقط الخادم عرض الموقع محتوى صحيحاً لا شاشة فارغة، وهذا مختبَر.' },
        { h: 'اختبارات على MySQL لا SQLite', b: 'المخطّط يعتمد على عمود مولَّد وفهرس نصّي كامل لا وجود لهما في SQLite، فالاختبار عليها كان سيمرّ بينما ينكسر الإنتاج. و٢٩ اختبار متصفح على API حقيقي كشفت ستّة عيوب فعلية في عبور جلسة Sanctum.' },
      ],
    },
    en: {
      idea: 'An orphan-sponsorship platform built around one idea: transparency. Not an anonymous donation, but a child with a name, a story and a verified file, a photo report every quarter, and an audited budget published to everyone. An Arabic public site, a Laravel server, a Vue admin panel and a sponsor portal, all on one origin.',
      problem: 'Charity sites write their numbers into the interface: "93% reaches the child" is a marketing line nobody can verify. The technical problem underneath is harder: how do you stop a sponsor sponsoring the same child twice while letting them come back after a cancellation, and how do you make a double charge impossible when someone taps Pay twice or the gateway resends a webhook?',
      solution: [
        { h: 'Every figure derived from the database', b: 'The spending ring is aggregated from approved disbursements, the reach percentage is a division, the number of field visits is a real count. Nothing is typed into the interface.' },
        { h: 'A partial constraint on an engine without them', b: 'A generated column equals 1 for active sponsorships and NULL otherwise, with a unique key over sponsor, child and that column. MySQL leaves NULL out of unique constraints, so cancelled sponsorships never block a return.' },
        { h: 'Four eyes on every disbursement', b: 'Whoever recorded a disbursement cannot approve it, and the policy checks that in code, not the interface. An approved entry is reversed with a counter-entry, never edited, and a unique idempotency key makes a double charge impossible in the engine.' },
      ],
      extras: [
        { h: 'One origin for everything', b: 'The public site, the admin panel and the API share one domain, so no CORS, no cross-site cookies, and the tightest possible content-security policy. The session is an HttpOnly cookie, not a token in localStorage.' },
        { h: 'A public site that works without a server', b: 'The data file is both seed and hydration layer: its written values work with no API at all, and a hydrate step swaps them for database values when the server is up. If the server falls over, the site shows correct content instead of a blank screen, and that is tested.' },
        { h: 'Tests on MySQL, not SQLite', b: 'The schema relies on a generated column and a full-text index that SQLite does not have, so a test suite on SQLite would pass while production broke. 29 browser tests against the real API found six real defects in how the Sanctum session crosses to the server.' },
      ],
    },
  },

  mawaheb: {
    ar: {
      idea: 'منصة اكتشاف مواهب عربية: موسيقيون وفنانون ومصممون وكتّاب ورياضيون ينشرون معرض أعمال حقيقياً، والكشّافون والعلامات التجارية يجدونهم. العربية هي الأصل، والإنجليزية هي الخيار الإضافي.',
      problem: 'العالم العربي بلا منصة مبنية لمواهبه. إنستغرام بلا عمق معرض أعمال، ولينكدإن منفصل ثقافياً عن العمل الإبداعي، وBehance وSoundCloud لم تُعرَّب يوماً: تخطيطات معكوسة وبحث لا يفهم العربية ولا سياق ثقافياً.',
      solution: [
        { h: 'Blade يعرض كل شيء، بلا إطار JavaScript', b: 'صفحات الاكتشاف يجب أن تُفهرَس وتفتح بسرعة على الهاتف، وتطبيق الصفحة الواحدة يخسر في الاثنين. فالخادم يعرض HTML، وJavaScript تحسين تدريجي فقط.' },
        { h: 'ثلاثة أنواع حسابات في طبقة البيانات', b: 'موهبة وكشّاف وعلامة تجارية تُفرَض بالوسطاء والسياسات لا بإخفاء الأزرار. الحد الأدنى ١٦ عاماً يُتحقّق منه من تاريخ الميلاد على الخادم، ومن هم بين ١٦ و١٧ يمرّون بموافقة وليّ الأمر.' },
        { h: 'قواعد تصمد تحت الاستخدام الحقيقي', b: 'الخطة المجانية تحدّ الأعمال المنشورة، والتقديم على الفرصة مرّة واحدة والانسحاب لا يسمح بإعادة التقديم، والفرص تُحفظ مسودّات قبل النشر.' },
      ],
      extras: [
        { h: 'عدّادات صادقة', b: 'المتابعون والطلبات والمشاهدات تُزاد داخل المعاملة نفسها التي تكتب الصف المسبّب، لأن عدّاداً ينحرف أسوأ من لا عدّاد.' },
        { h: 'حذف يحذف فعلاً', b: 'حذف ناعم، ثم فترة سماح مع إشعار بالبريد، ثم تطهير يزيل الصفوف والوسائط معاً. مسار محو حقيقي لا علامة مخفية.' },
        { h: 'اكتمال الملف معادلة', b: 'الصورة والنبذة فوق حدّ الطول وعدد أدنى من المهارات والأعمال والروابط والغلاف، لكل واحد وزن معرَّف. نسبة الاكتمال حساب لا تخمين. وutf8mb4 ليس خياراً افتراضياً بالصدفة: المحتوى العربي والبحث يحتاجانه.' },
      ],
    },
    en: {
      idea: 'An Arabic talent-discovery platform: musicians, artists, designers, writers and athletes publish a real portfolio, and scouts and brands find them. Arabic is the default and English is the toggle.',
      problem: 'The Arab world has no platform built for its own creative talent. Instagram has no portfolio depth, LinkedIn is culturally disconnected from creative work, and Behance and SoundCloud were never localised: mirrored layouts, search that does not understand Arabic, no cultural context.',
      solution: [
        { h: 'Blade renders everything, no JavaScript framework', b: 'Discovery pages have to be crawlable and open fast on a phone, and a single-page app loses on both. The server renders HTML and JavaScript is progressive enhancement only.' },
        { h: 'Three account types in the data layer', b: 'Talent, scout and brand are enforced by middleware and policies, not by hiding buttons. Minimum age 16 is validated from the birth date on the server, and 16 to 17 year olds clear guardian consent first.' },
        { h: 'Rules that hold under real use', b: 'The free plan caps published items, you apply once per opportunity and withdrawing does not let you re-apply, and opportunities are saved as drafts before they go live.' },
      ],
      extras: [
        { h: 'Honest counters', b: 'Followers, applications and views are incremented inside the same transaction as the row that caused them, because a counter that drifts is worse than no counter.' },
        { h: 'Deletion that actually deletes', b: 'Soft delete, a grace period with an email notice, then a purge that removes rows and stored media together. A real erasure path, not a hidden flag.' },
        { h: 'Profile completeness is a formula', b: 'Avatar, a bio over a length threshold, a minimum number of skills, portfolio items, social links and a cover each carry a defined weight. The percentage is arithmetic, not a guess. And utf8mb4 is not a default picked by accident: Arabic content and search need it.' },
      ],
    },
  },
};
