import SectionHead from "@/components/ui/SectionHead";
import Particles from "@/components/motion/Particles";
import Testimonials from "./Testimonials";

export default function Stories() {
  return (
    <section className="section testi" id="stories" aria-labelledby="testiTitle">
      <Particles />
      <div className="container">
        <SectionHead k="testi" icon="reviews" center />
        <Testimonials />
      </div>
    </section>
  );
}
