import { FAQ, PLATFORMS, PROJECTS, SERVICES, SVCPAGES, WMEDIA, type Locale } from "./data";
import { wCat, wName, work, workMedia } from "./site";

/* /ads — Omnexa Media packages campaign page.
   Offer structure follows omnexa.sa/ar/299 (hero → work → packages → what's included → steps → FAQ → CTA);
   every service, deliverable, step and claim comes from Omnexa Media's own data (SERVICES, SVCPAGES.social, FAQ,
   WORKS, the 2026 company profile figures already shown on the home page). The only price stated is the business'
   starting price (START_PRICE); no per-package price, quantity or deadline is stated: the site quotes per scope
   ("How is the cost of a service set?"). */

/* packages start from this price (SAR) — a starting price, never the price of a specific package */
export const START_PRICE = 423;

type Svc = { id: string; icon: string; ar: { t: string; d: string; f: string[] }; en: { t: string; d: string; f: string[] } };
type SocialPage = { feats: [string, string, string][]; why: [string, string, string][]; steps: [string, string][]; lead: string; ctaT: string; ctaP: string };

const svc = (id: string) => (SERVICES as unknown as Svc[]).find((s) => s.id === id)!;
const social = (l: Locale) => (SVCPAGES as unknown as Record<string, Record<Locale, SocialPage>>).social[l];

/* the seven media service categories offered as packages, in this order. All but "cinematic" come from the site's
   SERVICES (title, description and deliverables as published). "cinematic" has no SERVICES entry, so it carries a
   description only — no deliverables are listed for it. */
export type Pkg = { id: string; icon: string; t: string; d: string; f: string[] };
const PKG_IDS = ["social", "content", "graphic", "motion", "reels", "cinematic", "branding"] as const;
const CINEMATIC: Record<Locale, Omit<Pkg, "id" | "icon">> = {
  ar: { t: "إنتاج الأفلام السينمائية", d: "أفلام بجودة سينمائية تحكي قصة علامتك وتقدّم أعمالها بصورة احترافية تليق بها.", f: [] },
  en: { t: "Cinematic Film Production", d: "Films with a cinematic finish that tell your brand’s story and present its work the way it deserves.", f: [] },
};
export const packages = (l: Locale): Pkg[] =>
  PKG_IDS.map((id) => (id === "cinematic" ? { id, icon: "videocam", ...CINEMATIC[l] } : { id, icon: svc(id).icon, ...svc(id)[l] }));

/* the site's other listed services, offered alongside the packages */
const EXTRA_IDS = ["photo", "ads", "maps"] as const;
export const extras = (l: Locale) => EXTRA_IDS.map((id) => ({ id, icon: svc(id).icon, t: svc(id)[l].t }));

/* the six parts of the managed social-media service (social service page) */
export const included = (l: Locale) => social(l).feats;
export const reasons = (l: Locale) => social(l).why;
export const steps = (l: Locale) => social(l).steps;

/* site FAQ entries that apply to the package, in this order: cost, one service, platforms, duration, start */
const FAQ_PICK = [2, 3, 5, 6, 1];
export const faq = (l: Locale) => FAQ_PICK.map((i) => (FAQ as unknown as Record<Locale, [string, string]>[])[i][l]);

/* real client posts for the hero feed (portfolio "posts" works) */
export const FEED = ["bestwash-posts", "shorouk-posts", "nabaa-posts", "setcco-posts", "qudrat-posts", "bluekey-posts"]
  .map((id) => "/" + (WMEDIA as unknown as Record<string, { g: string[] }>)[id].g[0]);

/* real portfolio works for "our work at a glance": one per area (identity, social media, video) */
const SHOWCASE = ["bling-identity", "bestwash-posts", "og-motion"];
export const showcase = (l: Locale) => SHOWCASE.map((id) => {
  const w = work(id)!;
  return { id, cover: workMedia(w).cover!, n: wName(w, l), cat: wCat(w, l) };
});

export const platforms = () => PLATFORMS as unknown as { id: string; ar: string; en: string; bg: string; fg: string; d: string }[];
export const clientLogos = (l: Locale) => PROJECTS.filter((p) => p.logo && p.slug !== "jak").map((p) => ({ slug: p.slug, logo: `/${p.logo}`, name: p[l].client }));

/* the main Omnexa Media website (portfolio button) */
export const MAIN_SITE = "https://media.omnexa.sa";

/* page copy (Saudi/Gulf register, like the rest of the site) */
type Price = { from: string; cur: string; only: string };
type Copy = {
  meta: { title: string; desc: string };
  /* links: used by the landing footer only (the navbar has no section links) */
  nav: { links: [string, string][]; cta: string; menu: string; home: string };
  foot: { word: string };
  /* contact: the compact tel: link under the CTA (dials SITE.contact.phone) */
  hero: { h1a: string; h1b: string; sub: string; price: Price; cta: string; contact: string; visualAlt: string };
  overview: { k: string; t: string; p: string; cta: string; platT: string };
  inc: { k: string; t: string; p: string; note: string };
  add: { k: string; t: string; p: string; price: Price; priceNote: string; cta: string; waWith: string; extraT: string };
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
      title: "باقات أومنيكسا ميديا — تبدأ من 423 ر.س | سوشيال ميديا، محتوى، تصميم وفيديو",
      desc: "باقات إعلامية من أومنيكسا ميديا تبدأ من 423 ر.س: إدارة السوشيال ميديا، صناعة المحتوى، التصميم الجرافيكي، الموشن جرافيك، الريلز، الأفلام السينمائية والهوية البصرية.",
    },
    nav: {
      links: [["overview", "الباقة"], ["included", "تفاصيل الباقة"], ["addons", "الخدمات"], ["how", "طريقة العمل"], ["faq", "الأسئلة"]],
      cta: "اطلب باقتك الآن", menu: "القائمة", home: "أومنيكسا ميديا — الصفحة الرئيسية",
    },
    foot: { word: "خدمات أومنيكسا ميديا" },
    hero: {
      h1a: "خدمات إعلامية وإبداعية احترافية،",
      h1b: "تليق بعلامتك.",
      sub:  "سوشل ميديا, محتوى رقمي، تصميم جرافيكي ، موشن جرافيك، ريلز، افلام سينمائية نهتم بحضورك من الفكرة الى النتيجة",
      price: { from: "تبدأ الباقات من", cur: "ر.س", only: "فقط" },
      cta: "اطلب باقتك الآن",
      contact: "تواصل معنا",
      visualAlt: "منشورات صممتها أومنيكسا ميديا لعملائها",
    },
    overview: {
      k: "من أعمالنا",
      t: "أعمالنا باختصار",
      p: "هويات بصرية، ومحتوى سوشيال ميديا، وفيديوهات موشن — نماذج من مشاريع حقيقية نفذناها لعلامات في قطاعات مختلفة.",
      cta: "أعمالنا",
      platT: "على المنصات اللي يتواجد فيها جمهورك",
    },
    inc: {
      k: "باقة السوشيال ميديا",
      t: "وش تشمل باقة إدارة السوشيال ميديا؟",
      p: "من أول فكرة إلى المحتوى المنشور، نساعدك تقدم علامتك التجارية بصورة متناسقة ومحتوى يناسب جمهورك وأهدافك.",
      note: "نحدد معك نطاق كل بند وعدد المخرجات قبل البدء، حسب احتياج علامتك.",
    },
    add: {
      k: "باقاتنا الإعلامية",
      t: "باقات تغطي كل احتياج إعلامي لعلامتك",
      p: "اختر الخدمة اللي تحتاجها، أو اجمع أكثر من خدمة في باقة وحدة — ونرسل لك عرض سعر واضح يناسب نطاق عملك.",
      price: { from: "تبدأ الباقات من", cur: "ر.س", only: "فقط" },
      priceNote: "يتحدد سعر كل باقة حسب الخدمات المختارة ونطاقها، ونتفق معك على التفاصيل قبل البدء.",
      cta: "اطلب الباقة", waWith: "وأحتاج خدمة:",
      extraT: "خدمات إضافية",
    },
    why: {
      k: "ليش أومنيكسا ميديا؟",
      t: "لأن حضورك يستحق يكون مختلف",
      p: "فريق سعودي يجمع الإبداع والتخطيط والإنتاج تحت سقف واحد، ويبني لعلامتك حضور يتكلم عنه الناس.",
      stats: [["+50", "مشروعًا رقميًا أطلقناه"], ["90%", "رضا العملاء"]],
      clients: "علامات اشتغلنا معها",
    },
    how: { k: "طريقة العمل", t: "من الفكرة إلى حضور رقمي متكامل", p: "أربع خطوات واضحة، وأنت معنا في كل وحدة منها." },
    faq: { k: "استفسارات", t: "أسئلة قبل ما نبدأ", p: "إجابات سريعة عن الباقات والتكلفة والمنصات ومدة التنفيذ." },
    end: {
      k: "ابدأ اليوم",
      t: "خلّ حضور علامتك التجارية يتكلم عنك.",
      p: "ابدأ ببناء حضور رقمي أكثر تميزًا مع محتوى يعكس هويتك ويتواصل مع جمهورك بطريقة أفضل.",
      wa: "تواصل معنا على واتساب", call: "اتصل بنا",
    },
    form: {
      t: "اطلب عرض سعر لباقتك",
      p: "عبّئ بياناتك ونرسل لك عرضًا واضحًا يناسب احتياجك.",
      name: "الاسم", phone: "رقم الجوال",
      send: "أرسل الطلب عبر واتساب",
      note: "يفتح واتساب برسالة طلبك جاهزة للإرسال.",
      need: "فضلًا اكتب اسمك ورقم جوال صحيح.",
      msgName: "الاسم", msgPhone: "الجوال",
    },
    waText: "أهلًا أومنيكسا ميديا، أبغى أعرف تفاصيل باقاتكم الإعلامية.",
  },
  en: {
    meta: {
      title: "Omnexa Media Packages — from SAR 423 | Social media, content, design & video",
      desc: "Media packages from Omnexa Media starting at SAR 423: social media management, content creation, graphic design, motion graphics, reels, cinematic films and visual identity.",
    },
    nav: {
      links: [["overview", "Package"], ["included", "Package Details"], ["addons", "Services"], ["how", "How it works"], ["faq", "FAQ"]],
      cta: "Order your package now", menu: "Menu", home: "Omnexa Media — home page",
    },
    foot: { word: "Omnexa Media Services" },
    hero: {
      h1a: "Professional media & creative services,",
      h1b: "worthy of your brand.",
      sub: "Social media, digital content, graphic design, motion graphics, Reels, and cinematic films.We take care of your presence—from the initial idea to the final result.",
      price: { from: "Packages start from", cur: "SAR", only: "only" },
      cta: "Order your package now",
      contact: "Contact us",
      visualAlt: "Posts designed by Omnexa Media for its clients",
    },
    overview: {
      k: "From our portfolio",
      t: "Our work at a glance",
      p: "Visual identities, social media content and motion videos — samples of real projects we’ve delivered for brands across different sectors.",
      cta: "Our work",
      platT: "On the platforms where your audience is",
    },
    inc: {
      k: "Social media package",
      t: "What’s in the social media management package?",
      p: "From the first idea to published content, we help you present your brand consistently, with content that suits your audience and goals.",
      note: "We agree the scope of each item and the number of deliverables with you before we start, based on your brand’s needs.",
    },
    add: {
      k: "Our media packages",
      t: "Packages for every media need of your brand",
      p: "Pick the service you need, or combine several in one package — and we’ll send you a clear quote that fits your scope.",
      price: { from: "Packages start from", cur: "SAR", only: "only" },
      priceNote: "Each package is priced on the services you choose and their scope, and we agree the details with you before we start.",
      cta: "Request this package", waWith: "I need:",
      extraT: "Additional services",
    },
    why: {
      k: "Why Omnexa Media?",
      t: "Because your presence deserves to stand out",
      p: "A Saudi team bringing creativity, planning and production under one roof, building a presence people talk about.",
      stats: [["50+", "digital projects launched"], ["90%", "client satisfaction"]],
      clients: "Brands we’ve worked with",
    },
    how: { k: "How it works", t: "From idea to a complete digital presence", p: "Four clear steps, with you at every one of them." },
    faq: { k: "Questions", t: "Before we start", p: "Quick answers on the packages, cost, platforms and timing." },
    end: {
      k: "Start today",
      t: "Let your brand’s presence speak for you.",
      p: "Start building a more distinctive digital presence with content that reflects you and connects better with your audience.",
      wa: "Message us on WhatsApp", call: "Call us",
    },
    form: {
      t: "Request a quote for your package",
      p: "Leave your details and we’ll send you a clear offer that fits your needs.",
      name: "Name", phone: "Mobile number",
      send: "Send request via WhatsApp",
      note: "WhatsApp opens with your request ready to send.",
      need: "Please enter your name and a valid mobile number.",
      msgName: "Name", msgPhone: "Mobile",
    },
    waText: "Hello Omnexa Media, I’d like to know more about your media packages.",
  },
};
