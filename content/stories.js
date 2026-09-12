// The case study behind each project: the idea, the problem it answers, how it
// was solved, and the decisions worth explaining. Keyed by project slug.
// Same rule as everywhere else in content/: every sentence is backed by the
// project's own README, design notes or source. Nothing is invented.

export const STORIES = {
  diwan: {
    ar: {
      idea: 'متجر أثاث عربي يجيب عن السؤال الوحيد الذي يهمّ مشتري الأثاث فعلاً: هل تدخل هذه القطعة في غرفتي؟ الزبون يحفظ أبعاد غرفته مرّة واحدة، وكل صفحة منتج بعدها تعطيه حكماً على غرفته هو لا رقماً في جدول مواصفات.',
      problem: 'الأثاث أكثر فئة يفشل فيها الشراء أونلاين. كل المتاجر تعرض صورة على خلفية بيضاء ورقماً بالسنتيمتر لا يعني شيئاً لأحد، فتصل القطعة ولا تدخل من الباب أو تبتلع الغرفة. والمشكلة الثانية خفية: المخزون يُكتب يدوياً ولا يُخصم، فيبقى المنتج "متوفّراً" للزبائن ولمحرّكات البحث إلى الأبد.',
      solution: [
        { h: 'نظام الملاءمة', b: 'ثلاث قواعد تُحسب على غرفة الزبون: القطعة تتّسع لأطول جدار، ولا تأخذ أكثر من نصف الأرضية، ولها وجه أقل من ٨٠ سم يمرّ من الباب. وحين تُكسر أكثر من قاعدة يُقال له أسوأها لا أوّلها.' },
        { h: 'المخزون في قاعدة البيانات', b: 'الشراء يقفل صف المنتج داخل المعاملة التي تكتب الطلب، فلا يفوز اثنان بآخر قطعة. سلّة فيها سطر غير متوفّر تفشل كاملةً، والإلغاء يعيد المخزون مرّة واحدة فقط.' },
        { h: 'سجلّ لا يُمحى', b: 'سطر الطلب يحتفظ بلقطة من اسم المنتج وصورته، فسحب قطعة من الكتالوج لا يمحوها من طلبات الزبائن السابقة.' },
      ],
      extras: [
        { h: 'نظام تصميم تحرسه اختبارات', b: 'قواعد التصميم مكتوبة كاختبارات على قوالب Blade: لا لون خارج ملف الرموز، ولا استعلام داخل قالب، وكل صورة تمرّ عبر مكوّن واحد. القاعدة التي لا يفحصها أحد قاعدة سترجع.' },
        { h: 'بريد لا يزعج', b: 'أربع رسائل فقط تخرج من النظام: الإيصال، الشحن، التسليم، الإلغاء. الخطوات الداخلية لا تُرسل لأن متجراً يراسل على كل حركة يعلّم الناس تجاهل بريده. ولا شيء يعد بموعد تسليم لأن لا شيء في النظام يعرفه.' },
        { h: 'صور بمقاسات حقيقية', b: 'أمر واحد يولّد نسخ AVIF وWebP بالعرض الذي يستخدمه كل تخطيط، ويوجد فحص للنشر يكشف أي نشر تجاوز هذه الخطوة.' },
      ],
    },
    en: {
      idea: 'An Arabic-first furniture store that answers the only question a furniture buyer really has: will this piece fit my room? The customer saves the room once, and every product page after that gives a verdict against that room, not a number in a spec table.',
      problem: 'Furniture is where online shopping fails most often. Every store shows a photo on white and a centimetre figure that means nothing, so the piece arrives and does not clear the doorway or swallows the room. The second problem is quieter: stock was typed by hand and never decremented, so a product advertised itself as available forever, to shoppers and search engines alike.',
      solution: [
        { h: 'The fit system', b: 'Three rules computed against the customer\'s own room: the piece must fit the longest wall, take no more than half the floor, and have one face under 80 cm to clear a doorway. When more than one rule breaks, the customer is told the worst one, not the first checked.' },
        { h: 'Stock decided in the database', b: 'Checkout locks the product row inside the transaction that writes the order, so two people cannot both get the last piece. A cart with one unavailable line fails whole, and cancelling returns stock exactly once.' },
        { h: 'History that survives', b: 'An order line keeps a snapshot of the product name and image, so retiring a piece from the catalogue does not erase it from past orders.' },
      ],
      extras: [
        { h: 'A design system enforced by tests', b: 'The design rules are unit tests over the Blade templates: no colour outside the token file, no query inside a template, every photograph through one component. A rule nobody checks is a rule that comes back.' },
        { h: 'Email that does not nag', b: 'Only four messages leave the system: receipt, shipped, delivered, cancelled. Internal steps never email, because a shop that mails on every move trains people to ignore it. Nothing promises a delivery date, because nothing knows one.' },
        { h: 'Images at real sizes', b: 'One command derives AVIF and WebP at the widths each layout uses, with a deploy check that catches a release that skipped it.' },
      ],
    },
  },

  booking: {
    ar: {
      idea: 'نظام حجز مواعيد عربي أولاً: الزبون يحجز خدمة أونلاين بلا حساب ويستلم رقماً مرجعياً، والمنشأة تدير يومها كاملاً من كونسول واحد بخط زمن حيّ وطابور "يحتاج إجراء".',
      problem: 'معظم أنظمة الحجز التجريبية تخزّن الوقت كنص وتسمح بالحجز المزدوج. والأسوأ أن اثنين من المشغّلين يستطيعان تأكيد الموعد نفسه في الثانية نفسها، ولا تمنعهما الواجهة ولا فحص "قبل الكتابة"، لأن الفحصين يجريان قبل أن يرى أحدهما كتابة الآخر.',
      solution: [
        { h: 'التوفّر يُحسب لا يُخزَّن', b: 'الأوقات الحرّة تُولَّد من مدّة الخدمة، والفاصل بين المواعيد، والمورد المحجوز، وساعات العمل لذلك اليوم. لا جدول أوقات يُكتب يدوياً ثم يتقادم.' },
        { h: 'تعارض بفترات نصف مفتوحة', b: 'موعد ينتهي ١٠:٠٠ وآخر يبدأ ١٠:٠٠ لا يتعارضان، وأي تداخل حقيقي يتعارض. الحجوزات الملغاة تحرّر وقتها فوراً.' },
        { h: 'القفل حيث يهمّ', b: 'الـ API يقفل صف المورد قبل فحص التداخل داخل المعاملة التي تكتب الحجز، فالثاني يخسر دائماً. واختبار بجلستين متزامنتين حقيقيتين يثبت ذلك بدل تعليق في الكود.' },
      ],
      extras: [
        { h: 'نموذج بيانات قابل للقراءة آلياً', b: 'الأوقات بصيغة ISO 8601، والمبالغ بالوحدات الصغرى، والحالات قيم برمجية تُعرض عبر خريطة تسميات واحدة. هذا ما يجعل التقويم والفلاتر والمجاميع ممكنة أصلاً.' },
        { h: 'طبقة بيانات قابلة للتبديل', b: 'المستودع له تطبيقان: تخزين محلي في المتصفح، وAPI لارافيل. متغيّر بيئة واحد يبدّل بينهما ولا شيء فوق الفاصل يتغيّر، وهو ما يُبقي العرض الحيّ على Vercel يعمل بلا خادم.' },
        { h: 'حدّ صادق', b: 'القاعدة تحمي كل ما يكتب عبر التطبيق. عميل يملك بيانات قاعدة البيانات ويكتب SQL خاماً يستطيع إدخال تداخل، وهذا مذكور في الكود لا مخفيّ.' },
      ],
    },
    en: {
      idea: 'An Arabic-first appointment system: customers book a service online without an account and get a reference code, and the business runs its whole day from one console with a live now-line and a needs-attention queue.',
      problem: 'Most booking demos store a time as text and let you double-book. Worse, two operators can confirm the same slot in the same second, and neither the slot grid nor a check-before-write stops them, because both checks run before either sees the other\'s write.',
      solution: [
        { h: 'Availability is computed, not stored', b: 'Free slots are generated from the service duration, the buffer between appointments, the resource booked and the business hours for that weekday. No hand-written timetable that goes stale.' },
        { h: 'Half-open interval overlap', b: 'An appointment ending at 10:00 and one starting at 10:00 do not collide; any real overlap does. Cancelled bookings free their slot immediately.' },
        { h: 'The lock where it counts', b: 'The API locks the resource row before the overlap check, inside the transaction that writes the booking, so the second one always loses. A test with two live concurrent connections proves it instead of a comment.' },
      ],
      extras: [
        { h: 'A machine-readable model', b: 'Times are ISO 8601 instants, money is in minor units, statuses are machine values rendered through one label map. That is what makes the calendar, filters and totals possible at all.' },
        { h: 'A swappable data layer', b: 'The repository has two implementations: browser localStorage and the Laravel API. One environment variable picks between them and nothing above the seam changes, which is what keeps the live demo on Vercel working without a server.' },
        { h: 'An honest limit', b: 'The rule holds for anything writing through the application. A client with database credentials writing raw SQL could still insert an overlap, and the code says so rather than glossing it.' },
      ],
    },
  },

  takharruj: {
    ar: {
      idea: 'منصة تدير مشاريع التخرّج من أول فكرة حتى الدرجة النهائية، بثلاثة أدوار منفصلة: مدير يدير الفصل، ومشرف يراجع ويتابع ويقيّم، وطالب يقترح ويسلّم ويردّ. لكل دور لوحته وصلاحياته ومسار عمله.',
      problem: 'مشاريع التخرّج تُدار عادةً بجداول إكسل وسلاسل بريد وأوراق. لا أحد يملك جواباً واحداً على "أي المجموعات بلا مشرف؟" أو "أي المراحل تأخّرت؟" أو "أين آخر نسخة من ذلك الملف؟". وحين يكون الدفعة الجديدة ٣٠٠ طالب، فالإدخال اليدوي وحده يستهلك أسبوعاً.',
      solution: [
        { h: 'ثلاث مساحات لا واحدة', b: 'مجموعات مسارات منفصلة لكل دور، وحرّاس مصادقة مستقلون للطالب والمشرف والمدير، فلا يرى أحد إلا الجزء الذي يخصّه.' },
        { h: 'الاستيراد الجماعي', b: 'الطلاب والمشرفون يُستوردون من ملف Excel بضغطة، والمجموعات تُصدَّر بالطريقة نفسها. ٣٠٠ صف تصبح دقيقة بدل أسبوع.' },
        { h: 'مسار المشروع كاملاً', b: 'اقتراح، مراجعة، قبول أو رفض، مراحل بمواعيد، ملفات لكل مشروع، تعليقات متبادلة، ثم تقييم نهائي مسجّل على المشروع، وأرشيف للفصول السابقة.' },
      ],
      extras: [
        { h: 'جداول من جهة الخادم', b: 'الترقيم والفرز والبحث تجريها قاعدة البيانات عبر Yajra DataTables، فقائمة ٥٠٠ طالب تفتح بالسرعة نفسها التي تفتح بها قائمة ٥٠.' },
        { h: 'لوحة مدير لا تعيد الحساب', b: 'أرقام لوحة المدير مأخوذة من لقطات إحصائية دورية، لا من إعادة حساب كل شيء عند كل تحميل.' },
        { h: 'طبقة رموز واحدة', b: 'الموقع العام وشاشة الدخول واللوحات الثلاث تقرأ من ملفَّي رموز موثّقين في DESIGN_SYSTEM.md. تغيير الهوية يعني تعديل ملفين لا أربعين صفحة.' },
      ],
    },
    en: {
      idea: 'A platform that runs graduation projects from the first idea to the final grade, with three separate roles: an admin who runs the semester, a supervisor who reviews, tracks and grades, and a student who proposes, submits and replies. Each role gets its own dashboard, permissions and workflow.',
      problem: 'Graduation projects usually live in spreadsheets, email threads and paper. Nobody has one answer to "which groups have no supervisor yet", "which milestones are overdue" or "where is the latest version of that file". And when a new intake is 300 rows, manual entry alone eats a week.',
      solution: [
        { h: 'Three spaces, not one', b: 'Separate route groups per role and independent auth guards for student, supervisor and admin, so each person sees only the part that concerns them.' },
        { h: 'Bulk import', b: 'Students and supervisors come in from an Excel file in one step, and groups go out the same way. 300 rows become a minute instead of a week.' },
        { h: 'The whole project lifecycle', b: 'Proposal, review, accept or reject, milestones with deadlines, files per project, threaded comments, a final evaluation recorded on the project, and an archive of past semesters.' },
      ],
      extras: [
        { h: 'Server-side tables', b: 'Pagination, sorting and search run in the database through Yajra DataTables, so a list of 500 students opens as fast as a list of 50.' },
        { h: 'A dashboard that does not recompute', b: 'The admin dashboard reads from periodic stat snapshots rather than recalculating everything on every page load.' },
        { h: 'One token layer', b: 'The public site, the login screen and all three dashboards read from two documented token files described in DESIGN_SYSTEM.md. Rebranding means editing two files, not forty pages.' },
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
