import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import Hero from "@/components/sections/Hero";
import Platforms from "@/components/sections/Platforms";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Clients from "@/components/sections/Clients";
import Stories from "@/components/sections/Stories";
import SectionHead from "@/components/ui/SectionHead";
import FaqList from "@/components/sections/Faq";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale); // validated by the [locale] layout
  return (
    // #home: 42 rules in site.css are scoped to it
    <div id="home">
      <Hero />
      <Platforms />
      <Services />
      <About />
      <Work />
      <Process />
      <Clients />
      <Stories />
      <section className="section faq" id="faq" aria-labelledby="faqTitle">
        <div className="container faq-wrap">
          <div className="faq-side"><SectionHead k="faq" icon="quiz" /></div>
          <FaqList />
        </div>
      </section>
    </div>
  );
}
