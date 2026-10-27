"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { FAQ, type Locale } from "@/content/data";
import Ms from "@/components/ui/Ms";

/* app.js renderFaq: single-open accordion, first item open */
export default function FaqList() {
  const l = useLocale() as Locale;
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list" id="faqList">
      {FAQ.map((f, i) => {
        const on = i === open;
        return (
          <div key={i} className={`faq-item${on ? " open" : ""}`} data-reveal="" style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}>
            <h3 style={{ margin: 0 }}>
              <button className="faq-q" type="button" aria-expanded={on} aria-controls={`faq-a${i}`} id={`faq-q${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span>{f[l][0]}</span>
                <span className="pm" aria-hidden="true"><Ms name={on ? "remove" : "add"} /></span>
              </button>
            </h3>
            <div className="faq-a" id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`}>
              <div><p>{f[l][1]}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
