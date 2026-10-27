import { useLocale } from "next-intl";
import { PROJECTS, WORKS, type Locale, type Project } from "@/content/data";
import SectionHead from "@/components/ui/SectionHead";
import Img from "@/components/ui/Img";

/* app.js renderClients: two logo marquee rows (colour logo in light theme, white in dark) */
function Tile({ p, l, dup }: { p: Project; l: Locale; dup?: boolean }) {
  const fw = WORKS.find((x) => x.c === p.slug);
  return (
    <a className="ltile" href={fw ? `/${l}/work/${fw.id}` : `/${l}#work`} title={p[l].client} tabIndex={dup ? -1 : undefined}>
      {p.logo ? (
        <>
          <Img className="c" src={`/${p.logo}.png`} alt={p[l].client} sizes="180px" />
          <Img className="w" src={`/${p.logo}-w.png`} aria-hidden="true" sizes="180px" />
        </>
      ) : (
        <span className="txt">{p.en.client.toUpperCase()}</span>
      )}
    </a>
  );
}

function Row({ list, l }: { list: Project[]; l: Locale }) {
  // the list twice per half, then the whole thing again (aria-hidden) so the marquee loops seamlessly
  const half = (dup: boolean, key: string) => [...list, ...list].map((p, i) => <Tile key={`${key}${i}`} p={p} l={l} dup={dup || i >= list.length} />);
  return (
    <div>
      <div className="lr-track">
        {half(false, "a")}
        <div style={{ display: "contents" }} aria-hidden="true">{half(true, "b")}</div>
      </div>
    </div>
  );
}

export default function Clients() {
  const l = useLocale() as Locale;
  const shown = PROJECTS.filter((p) => p.slug !== "jak");
  const half = Math.ceil(shown.length / 2);
  return (
    <section className="section clients" id="partners" aria-labelledby="clientsTitle">
      <div className="container">
        <SectionHead k="clients" icon="handshake" center />
      </div>
      <div className="logo-rows" id="logoRows" data-reveal="">
        <Row list={shown.slice(0, half)} l={l} />
        <Row list={shown.slice(half)} l={l} />
      </div>
    </section>
  );
}
