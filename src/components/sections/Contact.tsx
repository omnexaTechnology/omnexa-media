import SectionHead from "@/components/ui/SectionHead";
import Booking from "./Booking";

/* shown on every page, after the page content (the reference kept it outside #home) */
export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contactTitle">
      <div className="container">
        <SectionHead k="contact" icon="event" center />
        <div className="form-v25">
          <Booking />
        </div>
      </div>
    </section>
  );
}
