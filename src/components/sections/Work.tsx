import SectionHead from "@/components/ui/SectionHead";
import WorkExplorer from "./WorkExplorer";

export default function Work() {
  return (
    <section className="section work" id="work" aria-labelledby="workTitle">
      <div className="container">
        <SectionHead k="work" icon="photo_library" center />
        <WorkExplorer />
      </div>
    </section>
  );
}
