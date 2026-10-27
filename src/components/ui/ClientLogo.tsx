import type { Project } from "@/content/data";
import Img from "./Img";

/* app.js logoImg(): colour (or white) client logo, text fallback when a client has none */
export default function ClientLogo({ p, alt, white }: { p: Project; alt: string; white?: boolean }) {
  if (!p.logo) return <span className="txt">{p.en.client.toUpperCase()}</span>;
  return <Img src={`/${p.logo}${white ? "-w" : ""}.png`} alt={alt} sizes="180px" decoding="async" />;
}
