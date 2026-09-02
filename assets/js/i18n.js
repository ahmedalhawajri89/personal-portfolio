/* ==========================================================================
   i18n.js — the entire copy of the site, in one place, in two languages.
   Nothing downstream hard-codes a sentence: every visible string lives here
   under a key, and the DOM carries only `data-i18n="key"`.

   Keys ending in `_html` are injected as HTML (they contain markup);
   everything else is injected as text, which is the safe default.
   ========================================================================== */

var I18N = {
  ar: {
    /* --- document ---------------------------------------------------- */
    doc_title: 'أحمد الحواجري — مطوّر ويب Full-Stack',
    doc_desc:  'مطوّر ويب Full-Stack من غزة. أبني تطبيقات ويب كاملة بـ Laravel و PHP و Vue 3 — من تصميم قاعدة البيانات إلى الواجهة، بعربية RTL أولاً.',

    /* --- nav --------------------------------------------------------- */
    nav_work: 'الأعمال',
    nav_services: 'الخدمات',
    nav_process: 'طريقة العمل',
    nav_about: 'عني',
    nav_contact: 'تواصل',
    nav_lang: 'EN',
    nav_lang_label: 'التبديل إلى الإنجليزية',
    nav_theme_label: 'تبديل الوضع الداكن',
    nav_menu_label: 'القائمة',
    skip: 'تخطَّ إلى المحتوى',

    /* --- hero -------------------------------------------------------- */
    hero_eyebrow: 'غزة، فلسطين · متاح للعمل عن بُعد',
    hero_title_html: 'أبني تطبيقات ويب <em>الصعوبة فيها في المنطق</em>، لا في الشكل.',
    hero_lede: 'مطوّر Full-Stack. أبدأ من نمذجة البيانات وأنتهي عند الواجهة — وبينهما القرارات التي تقرّر إن كان المنتج سيصمد: أين تُفرض القواعد، وكيف تُقاس المتاح، وماذا يحدث حين يخطئ المستخدم.',
    hero_cta_work: 'شاهد الأعمال',
    hero_cta_contact: 'ابدأ مشروعاً',
    hero_scroll: 'مرّر للأسفل',

    stat_1_v: '5',   stat_1_l: 'مشاريع كاملة منشورة',
    stat_2_v: '2',   stat_2_l: 'تجارب حيّة تُجرَّب الآن',
    stat_3_v: '3',   stat_3_l: 'مجموعات تقنية مختلفة',
    stat_4_v: '2022', stat_4_l: 'أبني منذ',

    /* --- services ---------------------------------------------------- */
    sv_title: 'ما الذي أقدّمه',
    sv_meta: 'الخدمات',
    sv_lede: 'لا أبيع «صفحات». أبني أنظمة تعمل بعد التسليم، ويستطيع مطوّر غيري أن يكمل عليها.',

    sv1_t: 'تطبيقات ويب متكاملة',
    sv1_d: 'من تحليل المتطلبات وتصميم قاعدة البيانات إلى الواجهة والنشر. Laravel أو Vue 3 حسب ما تحتاجه المشكلة، لا حسب ما أفضّله أنا.',
    sv2_t: 'لوحات تحكم وأنظمة إدارة',
    sv2_d: 'صلاحيات وأدوار، جداول كبيرة تعمل بسرعة، استيراد وتصدير Excel، تقارير ورسوم بيانية، وسجل لكل تغيير مهم.',
    sv3_t: 'واجهات عربية RTL',
    sv3_d: 'عربية من السطر الأول لا مقلوبة لاحقاً — بخصائص CSS المنطقية، فتعمل النسخة الإنجليزية بلا ملف أنماط ثانٍ.',
    sv4_t: 'نظام تصميم وتوثيق',
    sv4_d: 'كل لون ومسافة ونصف قطر يُعرَّف مرة واحدة. تغيير الهوية بعد سنة يلمس ملفاً أو اثنين، لا أربعين.',

    /* --- work -------------------------------------------------------- */
    w_title: 'أعمال مختارة',
    w_meta: '5 مشاريع',
    w_lede: 'كل مشروع أدناه كودُه مفتوح ويمكنك قراءته. اثنان منها منشوران ويمكنك تجربتهما الآن.',
    w_live: 'تجربة حيّة',
    w_code: 'الكود',
    w_why: 'الجزء المهم',

    p1_t: 'نظام إدارة الحجوزات',
    p1_k: 'تطبيق ويب · 2026',
    p1_s: 'نظام حجز مواعيد عربي بالكامل: الزبون يحجز بلا حساب ويستلم رقماً مرجعياً، وصاحب النشاط يدير يومه من ست شاشات خلف تسجيل دخول.',
    p1_w: 'أغلب أنظمة الحجز التجريبية تخزّن الوقت كنص وتسمح بحجز المورد مرتين. هنا المواعيد المتاحة تُحسب لحظياً من مدة الخدمة والفاصل الزمني والمورد وساعات العمل، والتعارض يُكتشف بتداخل الفترات نصف المفتوحة — فموعد ينتهي 10:00 وآخر يبدأ 10:00 لا يتعارضان. والقاعدة مطبَّقة داخل المعاملة التي تكتب الحجز: قفل على صف المورد قبل فحص التداخل، فمشغّلان يؤكّدان الفتحة نفسها في الثانية نفسها لا يفوزان معاً — وهذا مُثبَت باختبار يتسابق فيه اتصالان حقيقيان بقاعدة البيانات.',

    p2_t: 'Furnish — متجر أثاث إلكتروني',
    p2_k: 'تجارة إلكترونية · 2025',
    p2_s: 'متجر كامل بواجهة زبون ولوحة إدارة: تصفّح ومتغيّرات منتجات وتقييمات وسلة وكوبونات وشحن، وإدارة طلبات ومخزون خلفها.',
    p2_w: 'الجوهر في المخطط: 24 نموذجاً عبر أربعة نطاقات — الكتالوج والشراء والعميل والعمليات. وبنود الطلب تحفظ السعر وقت الشراء، فتغيير سعر لاحقاً لا يعيد كتابة تاريخ طلب سابق. هذه تفصيلة صغيرة تفصل بين متجر يعمل ومتجر يفسد محاسبته بعد أول تخفيض.',

    p3_t: 'نظام متابعة مشاريع التخرّج',
    p3_k: 'نظام جامعي · 2025',
    p3_s: 'إدارة مشاريع التخرّج من الفكرة إلى الدرجة النهائية، بثلاثة أدوار: مدير ومشرف وطالب، لكل منهم لوحته وصلاحياته.',
    p3_w: 'استيراد جماعي من Excel — وهذا يهم فعلاً حين تكون الدفعة 300 صف. والقوائم الكبيرة تعمل بجداول تُعالَج في الخادم لا في المتصفح، وأرقام اللوحة تُقرأ من لقطات إحصائية دورية بدل إعادة حسابها في كل تحميل. واللوحات الثلاث تتقاسم طبقة توكنات واحدة موثّقة في DESIGN_SYSTEM.md: اللون ونصف القطر والظل والحركة تُعرَّف مرة واحدة في ملفَّي أنماط، لا داخل الصفحات.',

    p4_t: 'مواهب — منصة اكتشاف المواهب',
    p4_k: 'منصة · 2024',
    p4_s: 'منصة عربية ينشر فيها المبدعون أعمالهم ويتقدّمون للفرص: ملف متعدد الخطوات، اكتشاف وفلترة، متابعة، وتتبّع للطلبات.',
    p4_w: 'العربية هي الاتجاه الأساسي، منفَّذة بخصائص CSS المنطقية لا بملف أنماط مقلوب — فزر الإنجليزية لا يكلّف شيئاً بنيوياً. والمستودع يحمل التفكير مع الكود: وثيقة متطلبات، ومعمارية، ومعمارية معلومات، ومسارات مستخدم، ونظام تصميم.',

    p5_t: 'كفالة — منصة كفالة أيتام',
    p5_k: 'تطبيق ويب كامل · 2026',
    p5_s: 'سبع عشرة صفحة عربية RTL، وخادم Laravel 12 على MySQL، ولوحة إدارة Vue 3 في ستّ عشرة شاشة، وبوابة يتابع فيها الكافل الطفل الذي يكفله — كلها من أصل واحد، فلا CORS ولا كوكيز عابرة للأصول. والتجربة أدناه لقطة ساكنة من الموقع العام وحده؛ الـ API واللوحة والبوابة تحتاج PHP و MySQL وتُشغَّل محلياً.',
    p5_demo: 'جرّب الموقع العام',
    p5_live: 'الموقع العام حيّ',
    p5_w: 'كل رقم يعلنه الموقع مُشتقٌّ من قاعدة البيانات لا مكتوبٌ في الواجهة: نسبة «٩٣٪ تصل للطفل» ناتج قسمة، وعدد الزيارات الميدانية COUNT(*). وأربعة وأربعون جدولاً وراء ذلك، فيها قيد جزئي حقيقي على MySQL بعمود مُولَّد — يمنع كفالة الطفل نفسه مرتين في وقت واحد، ويسمح بالعودة بعد الإلغاء.',

    /* --- process ----------------------------------------------------- */
    pr_title: 'كيف أعمل',
    pr_meta: 'الطريقة',
    pr_lede: 'أربع مراحل واضحة. تعرف في كل لحظة أين وصل العمل وما الذي ينتظرك.',
    pr1_t: 'نفهم المشكلة',
    pr1_d: 'جلسة نحدّد فيها من المستخدم، وما القرار الذي يتخذه في كل شاشة، وما الذي لن نبنيه في النسخة الأولى.',
    pr2_t: 'نمذجة البيانات',
    pr2_d: 'المخطط قبل الشاشات. الجداول والعلاقات والقيود — لأن ما تخطئ فيه هنا يظهر بعد ستة أشهر ويكلّف عشرة أضعاف.',
    pr3_t: 'البناء على دفعات',
    pr3_d: 'تسليم قابل للتجربة كل أسبوع، لا صندوق مغلق يُفتح في النهاية. تُعلّق على شيء يعمل لا على وصف مكتوب.',
    pr4_t: 'تسليم موثّق',
    pr4_d: 'الكود ووثيقة تشرح البنية والقرارات، ونشر يعمل. تستطيع أنت أو أي مطوّر بعدي أن يكمل بلا أن يسألني.',

    /* --- about ------------------------------------------------------- */
    ab_title: 'عني',
    ab_meta: 'نبذة',
    ab_p1: 'أنا أحمد الحواجري، مطوّر ويب Full-Stack من غزة، خرّيج تكنولوجيا المعلومات التطبيقية من جامعة الأقصى عام 2022. منذ ذلك الحين بنيت خمسة تطبيقات كاملة من الفكرة إلى النشر، جميعها مفتوحة المصدر.',
    ab_p2: 'أهتم بالجزء الذي لا يظهر في اللقطات: أين تُفرض القاعدة، وهل تصمد حين يتجاوز أحدهم الواجهة، وهل يستطيع مطوّر جديد أن يفهم الكود بعد ستة أشهر. لهذا تجد في مشاريعي قيوداً على مستوى قاعدة البيانات، ونظام تصميم موثّقاً، واختبارات تغطي المسار الكامل.',
    ab_p3: 'أعمل بالعربية والإنجليزية، وأبني الواجهات العربية RTL من السطر الأول لا مقلوبة لاحقاً. متاح للعمل عن بُعد بتداخل كامل مع ساعات العمل في أوروبا والخليج.',
    ab_g1: 'الخلفية',
    ab_g2: 'الواجهة',
    ab_g3: 'قواعد البيانات',
    ab_g4: 'الأدوات والممارسات',
    ab_cv: 'حمّل السيرة الذاتية',

    /* --- contact ----------------------------------------------------- */
    ct_title: 'عندك مشروع، أو وظيفة مناسبة؟',
    ct_text: 'اكتب لي سطرين عمّا تحتاجه وسأرد خلال يوم عمل. وإن كنت غير متأكد من النطاق بعد، هذا طبيعي — نتحدث ونحدّده معاً.',
    ct_mail: 'راسلني',
    ct_copy: 'نسخ البريد',
    ct_copied: 'تم نسخ البريد',
    ct_wa: 'واتساب',
    ct_meta: 'متاح للعمل عن بُعد ومن غزة',

    /* --- footer ------------------------------------------------------ */
    ft_rights: 'أحمد الحواجري — كل الحقوق محفوظة',
    ft_built: 'مبني بـ HTML و CSS و JavaScript خالصة. بلا إطار عمل وبلا خطوة بناء.',
    to_top: 'العودة إلى الأعلى'
  },

  en: {
    doc_title: 'Ahmed Al-Hawajiri — Full-Stack Web Developer',
    doc_desc:  'Full-stack web developer based in Gaza. I build complete web applications with Laravel, PHP and Vue 3 — from the database schema to the interface, Arabic-first with full RTL.',

    nav_work: 'Work',
    nav_services: 'Services',
    nav_process: 'Process',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_lang: 'ع',
    nav_lang_label: 'Switch to Arabic',
    nav_theme_label: 'Toggle dark mode',
    nav_menu_label: 'Menu',
    skip: 'Skip to content',

    hero_eyebrow: 'Gaza, Palestine · Open to remote work',
    hero_title_html: 'I build web apps where the hard part is <em>the logic</em>, not the layout.',
    hero_lede: 'Full-stack developer. I start at the data model and finish at a typed front end — and in between sit the decisions that decide whether a product holds up: where the rules are enforced, how availability is computed, and what happens when a user gets it wrong.',
    hero_cta_work: 'See the work',
    hero_cta_contact: 'Start a project',
    hero_scroll: 'Scroll',

    stat_1_v: '5',    stat_1_l: 'complete published projects',
    stat_2_v: '2',    stat_2_l: 'live demos you can try',
    stat_3_v: '3',    stat_3_l: 'different stacks',
    stat_4_v: '2022', stat_4_l: 'building since',

    sv_title: 'What I do',
    sv_meta: 'Services',
    sv_lede: 'I do not sell pages. I build systems that keep working after handover, and that another developer can pick up.',

    sv1_t: 'Complete web applications',
    sv1_d: 'From requirements and schema design through to the interface and deployment. Laravel or Vue 3 depending on what the problem needs, not on what I prefer.',
    sv2_t: 'Dashboards and admin systems',
    sv2_d: 'Roles and permissions, large tables that stay fast, Excel import and export, reports and charts, and an audit trail for every change that matters.',
    sv3_t: 'Arabic-first RTL interfaces',
    sv3_d: 'Arabic from the first line, not mirrored afterwards — built on CSS logical properties, so the English version costs nothing structurally.',
    sv4_t: 'Design systems and documentation',
    sv4_d: 'Every colour, spacing value and radius defined once. A rebrand a year later touches one or two files instead of forty.',

    w_title: 'Selected work',
    w_meta: '5 projects',
    w_lede: 'Every project below is open source and readable. Two of them are deployed and you can try them right now.',
    w_live: 'Live demo',
    w_code: 'Source',
    w_why: 'The part that matters',

    p1_t: 'Booking Management System',
    p1_k: 'Web application · 2026',
    p1_s: 'An Arabic-first appointment booking system: guests book without an account and get a reference code, while the business runs the whole day from six screens behind authentication.',
    p1_w: 'Most booking demos store a time as text and let you double-book. Here availability is computed live from service duration, buffer time, resource and business hours, and conflicts are detected with half-open interval overlap — so an appointment ending at 10:00 and one starting at 10:00 do not collide. And the rule is enforced inside the transaction that writes the booking: the resource row is locked before the overlap test, so two operators confirming the same slot in the same second cannot both win — proven by a test that races two live database connections.',

    p2_t: 'Furnish — Furniture E-Commerce',
    p2_k: 'E-commerce · 2025',
    p2_s: 'A complete store with a customer storefront and an admin dashboard: browsing, product variants, reviews, cart, coupons and shipping, with order and inventory management behind it.',
    p2_w: 'The schema is the substance: 24 models across four domains — catalogue, purchase, customer and operations. Order line items capture the price at purchase time, so a later price change never rewrites the history of an order already placed. A small detail that separates a working store from one whose accounting breaks after the first sale.',

    p3_t: 'Graduation Project Tracker',
    p3_k: 'University system · 2025',
    p3_s: 'Managing graduation projects from first idea to final grade across three roles — admin, supervisor and student — each with its own dashboard and permissions.',
    p3_w: 'Bulk import from Excel, which matters when an intake is 300 rows. Large lists use server-side data tables rather than shipping everything to the browser, and dashboard figures are read from periodic stat snapshots instead of being recalculated on every page load. All three role dashboards share one token layer documented in DESIGN_SYSTEM.md — colour, radius, shadow and motion defined once across two stylesheets rather than hard-coded inside pages.',

    p4_t: 'Mawaheb — Talent Discovery Platform',
    p4_k: 'Platform · 2024',
    p4_s: 'An Arabic platform where creatives publish their work and apply to opportunities: multi-step profiles, discovery and filtering, a follow system and per-opportunity application tracking.',
    p4_w: 'Arabic is the primary direction, implemented with CSS logical properties rather than a second flipped stylesheet — so the English toggle costs nothing structurally. The repository ships the thinking alongside the code: PRD, architecture, information architecture, user flows and a design system.',

    p5_t: 'Kafala — Orphan Sponsorship Platform',
    p5_k: 'Full web application · 2026',
    p5_s: 'Seventeen Arabic RTL pages, a Laravel 12 API on MySQL, a sixteen-screen Vue 3 admin console and a sponsor portal — all served from a single origin, so there is no CORS and no cross-origin cookies. The demo below is a static snapshot of the public site only; the API, admin console and sponsor portal need PHP and MySQL and run locally.',
    p5_demo: 'Try the public site',
    p5_live: 'Public site live',
    p5_w: 'Every figure the site publishes is derived from the database rather than typed into the page: the "93% reaches the child" number is a division, and the field-visit count is a COUNT(*). Forty-four tables sit behind that, including a real partial unique constraint on MySQL built from a generated column — it stops the same child being sponsored twice at once, while still allowing a sponsor to return after cancelling.',

    pr_title: 'How I work',
    pr_meta: 'Process',
    pr_lede: 'Four clear stages. You always know where the work stands and what is waiting on you.',
    pr1_t: 'Understand the problem',
    pr1_d: 'A session to establish who the user is, what decision they make on each screen, and what we are deliberately not building in version one.',
    pr2_t: 'Model the data',
    pr2_d: 'The schema before the screens. Tables, relationships and constraints — because a mistake here surfaces six months later and costs ten times as much.',
    pr3_t: 'Build in increments',
    pr3_d: 'Something you can click every week, not a sealed box opened at the end. You give feedback on a working thing, not on a written description.',
    pr4_t: 'Documented handover',
    pr4_d: 'The code, a document explaining the structure and the decisions, and a working deployment. You or any developer after me can continue without asking me.',

    ab_title: 'About',
    ab_meta: 'Background',
    ab_p1: 'I am Ahmed Al-Hawajiri, a full-stack web developer based in Gaza, with a BSc in Applied Information Technology from Al-Aqsa University (2022). Since then I have built five complete applications end to end, all of them open source.',
    ab_p2: 'I care about the part that never shows up in a screenshot: where the rule is enforced, whether it holds when someone bypasses the interface, and whether a new developer can understand the code six months later. That is why my projects carry database-level constraints, a documented design system, and tests that cover the full path.',
    ab_p3: 'I work in Arabic and English, and I build Arabic RTL interfaces from the first line rather than mirroring them afterwards. Available for remote work with full overlap with European and Gulf working hours.',
    ab_g1: 'Back end',
    ab_g2: 'Front end',
    ab_g3: 'Databases',
    ab_g4: 'Tooling and practice',
    ab_cv: 'Download my CV',

    ct_title: 'Have a project, or a role that fits?',
    ct_text: 'Send me two lines about what you need and I will reply within one working day. And if the scope is not clear to you yet, that is normal — we can work it out together.',
    ct_mail: 'Email me',
    ct_copy: 'Copy email',
    ct_copied: 'Email copied',
    ct_wa: 'WhatsApp',
    ct_meta: 'Available remotely and from Gaza',

    ft_rights: 'Ahmed Al-Hawajiri — All rights reserved',
    ft_built: 'Built with plain HTML, CSS and JavaScript. No framework, no build step.',
    to_top: 'Back to top'
  }
};

/* ---- Applying a language ------------------------------------------------
   One function does everything: swaps the strings, flips `dir`, updates the
   metadata that search engines and social cards read, and remembers the
   choice. Nothing else in the codebase needs to know a second language
   exists. */
function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.ar;
  const html = document.documentElement;

  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (value === undefined) return;
    if (key.endsWith('_html')) el.innerHTML = value;
    else el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-label]').forEach((el) => {
    const value = dict[el.getAttribute('data-i18n-label')];
    if (value !== undefined) el.setAttribute('aria-label', value);
  });

  document.title = dict.doc_title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', dict.doc_desc);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', dict.doc_title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', dict.doc_desc);
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute('content', lang === 'ar' ? 'ar_PS' : 'en_US');

  try { localStorage.setItem('lang', lang); } catch (e) { /* private mode */ }
}

/* Exposed on `window` rather than exported as an ES module. A module would
   be cleaner, but modules are blocked under the `file://` protocol, and this
   page should open correctly by double-clicking it — not only over HTTP. */
window.I18N = I18N;
window.applyLanguage = applyLanguage;
