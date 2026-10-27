"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { WORKS, type Locale } from "@/content/data";
import SxCard from "@/components/sections/SxCard";

/* related works on a project page: the same strip cards as the home portfolio; hover/click opens one */
export default function RelatedRow({ ids }: { ids: string[] }) {
  const l = useLocale() as Locale;
  const [open, setOpen] = useState(0);
  const list = ids.map((id) => WORKS.find((w) => w.id === id)!);
  return (
    <div
      className="sx"
      id="relSx"
      onMouseOver={(e) => {
        const c = (e.target as HTMLElement).closest<HTMLElement>(".sx-c:not(.on)");
        if (c && matchMedia("(hover: hover)").matches) setOpen(+c.dataset.sx!);
      }}
    >
      {list.map((w, n) => <SxCard key={w.id} w={w} n={n} on={n === open} l={l} onOpen={setOpen} />)}
    </div>
  );
}
