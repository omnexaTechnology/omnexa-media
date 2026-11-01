import { FAQ, PLATFORMS, PROJECTS, SERVICES, SVCPAGES, WMEDIA, type Locale } from "./data";

/* /ads — "Digital Presence Package" campaign page.
   Offer structure follows omnexa.sa/ar/299 (hero → package → what's included → optional add-ons → steps → FAQ → CTA);
   every service, deliverable, step and claim comes from Omnexa Media's own data (SERVICES, SVCPAGES.social, FAQ,
   the 2026 company profile figures already shown on the home page). No price, quantity or deadline is stated:
   the site quotes per scope ("How is the cost of a service set?"). */

type Svc = { id: string; icon: string; ar: { t: string; d: string; f: string[] }; en: { t: string; d: string; f: string[] } };
type SocialPage = { feats: [string, string, string][]; why: [string, string, string][]; steps: [string, string][]; lead: string; ctaT: string; ctaP: string };

const svc = (id: string) => (SERVICES as unknown as Svc[]).find((s) => s.id === id)!;
const social = (l: Locale) => (SVCPAGES as unknown as Record<string, Record<Locale, SocialPage>>).social[l];

/* the core of the package is the social-media management service; these extend it (all listed services of the site) */
export const ADDON_IDS = ["reels", "photo", "motion", "graphic", "content", "ads", "maps", "branding"] as const;
export const addons = (l: Locale) => ADDON_IDS.map((id) => { const s = svc(id); return { id, icon: s.icon, ...s[l] }; });

/* the six parts of the managed service (social service page) */
export const included = (l: Locale) => social(l).feats;
export const reasons = (l: Locale) => social(l).why;
export const steps = (l: Locale) => social(l).steps;

/* site FAQ entries that apply to the package, in this order: cost, one service, platforms, duration, start */
const FAQ_PICK = [2, 3, 5, 6, 1];
export const faq = (l: Locale) => FAQ_PICK.map((i) => (FAQ as unknown as Record<Locale, [string, string]>[])[i][l]);

/* real client posts for the hero feed (portfolio "posts" works) */
export const FEED = ["bestwash-posts", "shorouk-posts", "nabaa-posts", "setcco-posts", "qudrat-posts", "bluekey-posts"]
  .map((id) => "/" + (WMEDIA as unknown as Record<string, { g: string[] }>)[id].g[0]);

export const platforms = () => PLATFORMS as unknown as { id: string; ar: string; en: string; bg: string; fg: string; d: string }[];
export const clientLogos = (l: Locale) => PROJECTS.filter((p) => p.logo && p.slug !== "jak").map((p) => ({ slug: p.slug, logo: `/${p.logo}`, name: p[l].client }));

/* page copy (Saudi/Gulf register, like the rest of the site) */
type Copy = {
  meta: { title: string; desc: string };
  nav: { links: [string, string][]; cta: string; menu: string; close: string; home: string };
  foot: { word: string };
  hero: { kicker: string; h1a: string; h1b: string; sub: string; cta: string; visualAlt: string };
  overview: { k: string; t: string; p: string; pillars: [string, string, string][]; platT: string };
  inc: { k: string; t: string; p: string; note: string };
  add: { k: string; t: string; p: string; cta: string; waWith: string };
  why: { k: string; t: string; p: string; stats: [string, string][]; clients: string };
  how: { k: string; t: string; p: string };
  faq: { k: string; t: string; p: string };
  end: { k: string; t: string; p: string; wa: string; call: string };
  form: { t: string; p: string; name: string; phone: string; send: string; note: string; need: string; msgName: string; msgPhone: string };
  waText: string;
};

export const COPY: Record<Locale, Copy> = {
  ar: {
    meta: {
      title: "باقة الحضور الرقمي — إدارة السوشيال ميديا وصناعة المحتوى | أومنيكسا ميديا",
      desc: "باقة متكاملة من أومنيكسا ميديا: استراتيجية محتوى، تصميم منشورات، ريلز وفيديو، نشر وإدارة تفاعل، وتقارير أداء — مع خدمات إضافية تختارها حسب احتياج علامتك.",
    },
    nav: {
      links: [["overview", "الباقة"], ["included", "تفاصيل الباقة"], ["addons", "الخدمات"], ["how", "طريقة العمل"], ["faq", "الأسئلة"]],
      cta: "اطلب الباقة الآن", menu: "القائمة", close: "إغلاق القائمة", home: "أومنيكسا ميديا — الصفحة الرئيسية",
    },
    foot: { word: "خدمات أومنيكسا ميديا" },
    hero: {
      kicker: "باقة الحضور الرقمي",
      h1a: "حضور رقمي يليق بعلامتك،",
      h1b: "في باقة وحدة.",
      sub: "سوشيال ميديا، محتوى، تصاميم وريلز — فريق واحد يهتم بحضورك من الفكرة إلى النتيجة.",
      cta: "اطلب الباقة الآن",
      visualAlt: "منشورات صممتها أومنيكسا ميديا لعملائها",
    },
    overview: {
      k: "الباقة باختصار",
      t: "فريق كامل لحضورك الرقمي، بدل ما توزّع الشغل على أكثر من جهة.",
      p: "نجمع التخطيط والإبداع والإنتاج والمتابعة تحت سقف واحد، عشان يطلع محتواك متناسق ويخدم أهدافك على كل منصة.",
      pillars: [
        ["calendar_month", "نخطط", "استراتيجية محتوى وخطة نشر واضحة مبنية على جمهورك وأهدافك."],
        ["brush", "نصنع", "تصاميم وريلز ومحتوى مكتوب بلغة جمهورك وهوية علامتك."],
        ["insights", "نتابع وننمّي", "نشر منتظم وإدارة تفاعل وتقارير توضح وش اللي ينجح."],
      ],
      platT: "على المنصات اللي يتواجد فيها جمهورك",
    },
    inc: {
      k: "وش تشمل الباقة؟",
      t: "كل تفاصيل حضورك الرقمي، نهتم فيها",
      p: "من أول فكرة إلى المحتوى المنشور، نساعدك تقدم علامتك التجارية بصورة متناسقة ومحتوى يناسب جمهورك وأهدافك.",
      note: "نحدد معك نطاق كل بند وعدد المخرجات قبل البدء، حسب احتياج علامتك.",
    },
    add: {
      k: "خدمات تكمّل باقتك",
      t: "خصّص الباقة على مقاس علامتك",
      p: "خدمات تقدر تضيفها لباقتك حسب احتياجك — اطلب اللي يناسبك ونضمّنه في عرض السعر اللي نرسله لك.",
      cta: "ابدأ طلبك", waWith: "وأحتاج معها خدمة:",
    },
    why: {
      k: "ليش أومنيكسا ميديا؟",
      t: "لأن حضورك يستحق يكون مختلف",
      p: "فريق سعودي يجمع الإبداع والتخطيط والإنتاج تحت سقف واحد، ويبني لعلامتك حضور يتكلم عنه الناس.",
      stats: [["+50", "مشروعًا رقميًا أطلقناه"], ["90%", "رضا العملاء"]],
      clients: "علامات اشتغلنا معها",
    },
    how: { k: "طريقة العمل", t: "من الفكرة إلى حضور رقمي متكامل", p: "أربع خطوات واضحة، وأنت معنا في كل وحدة منها." },
    faq: { k: "استفسارات", t: "أسئلة قبل ما نبدأ", p: "إجابات سريعة عن الباقة والتكلفة والمنصات ومدة التنفيذ." },
    end: {
      k: "ابدأ اليوم",
      t: "خلّ حضور علامتك التجارية يتكلم عنك.",
      p: "ابدأ ببناء حضور رقمي أكثر تميزًا مع محتوى يعكس هويتك ويتواصل مع جمهورك بطريقة أفضل.",
      wa: "تواصل معنا على واتساب", call: "اتصل بنا",
    },
    form: {
      t: "اطلب عرض سعر للباقة",
      p: "عبّئ بياناتك ونرسل لك عرضًا واضحًا يناسب احتياجك.",
      name: "الاسم", phone: "رقم الجوال",
      send: "أرسل الطلب عبر واتساب",
      note: "يفتح واتساب برسالة طلبك جاهزة للإرسال.",
      need: "فضلًا اكتب اسمك ورقم جوال صحيح.",
      msgName: "الاسم", msgPhone: "الجوال",
    },
    waText: "أهلًا أومنيكسا ميديا، أبغى أعرف تفاصيل باقة الحضور الرقمي.",
  },
  en: {
    meta: {
      title: "Digital Presence Package — Social media management & content | Omnexa Media",
      desc: "A complete package from Omnexa Media: content strategy, post design, reels and video, publishing and community management, and performance reports — plus add-on services chosen for your brand.",
    },
    nav: {
      links: [["overview", "Package"], ["included", "Package Details"], ["addons", "Services"], ["how", "How it works"], ["faq", "FAQ"]],
      cta: "Request the package", menu: "Menu", close: "Close menu", home: "Omnexa Media — home page",
    },
    foot: { word: "Omnexa Media Services" },
    hero: {
      kicker: "Digital Presence Package",
      h1a: "A digital presence worthy of your brand,",
      h1b: "in one package.",
      sub: "Social media, content, design and reels — one team taking care of your presence from idea to results.",
      cta: "Request the package",
      visualAlt: "Posts designed by Omnexa Media for its clients",
    },
    overview: {
      k: "The package at a glance",
      t: "A whole team for your digital presence, instead of spreading the work across several suppliers.",
      p: "Planning, creative, production and follow-up under one roof, so your content stays consistent and serves your goals on every platform.",
      pillars: [
        ["calendar_month", "We plan", "A content strategy and a clear publishing plan built on your audience and goals."],
        ["brush", "We create", "Designs, reels and copy in your audience’s language and your brand’s identity."],
        ["insights", "We follow up & grow", "Regular publishing, community management and reports that show what works."],
      ],
      platT: "On the platforms where your audience is",
    },
    inc: {
      k: "What’s included?",
      t: "Every detail of your digital presence, taken care of",
      p: "From the first idea to published content, we help you present your brand consistently, with content that suits your audience and goals.",
      note: "We agree the scope of each item and the number of deliverables with you before we start, based on your brand’s needs.",
    },
    add: {
      k: "Services to extend your package",
      t: "Tailor the package to your brand",
      p: "Services you can add to your package as you need them — request what suits you and we’ll include it in the quote we send you.",
      cta: "Start your request", waWith: "I’d also need:",
    },
    why: {
      k: "Why Omnexa Media?",
      t: "Because your presence deserves to stand out",
      p: "A Saudi team bringing creativity, planning and production under one roof, building a presence people talk about.",
      stats: [["50+", "digital projects launched"], ["90%", "client satisfaction"]],
      clients: "Brands we’ve worked with",
    },
    how: { k: "How it works", t: "From idea to a complete digital presence", p: "Four clear steps, with you at every one of them." },
    faq: { k: "Questions", t: "Before we start", p: "Quick answers on the package, cost, platforms and timing." },
    end: {
      k: "Start today",
      t: "Let your brand’s presence speak for you.",
      p: "Start building a more distinctive digital presence with content that reflects you and connects better with your audience.",
      wa: "Message us on WhatsApp", call: "Call us",
    },
    form: {
      t: "Request a quote for the package",
      p: "Leave your details and we’ll send you a clear offer that fits your needs.",
      name: "Name", phone: "Mobile number",
      send: "Send request via WhatsApp",
      note: "WhatsApp opens with your request ready to send.",
      need: "Please enter your name and a valid mobile number.",
      msgName: "Name", msgPhone: "Mobile",
    },
    waText: "Hello Omnexa Media, I’d like to know more about the Digital Presence Package.",
  },
};
