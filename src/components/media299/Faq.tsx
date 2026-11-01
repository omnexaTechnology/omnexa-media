"use client";

import { useState } from "react";
import Ms from "@/components/ui/Ms";

/* /ads FAQ: single-open accordion (first open), same behaviour as the home FAQ, own markup and styles */
export default function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="m-faq-list">
      {items.map(([q, a], i) => {
        const on = i === open;
        return (
          <div key={q} className={`m-faq${on ? " open" : ""}`}>
            <h3>
              <button type="button" id={`mfq${i}`} aria-expanded={on} aria-controls={`mfa${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span>{q}</span>
                <i aria-hidden="true"><Ms name={on ? "remove" : "add"} /></i>
              </button>
            </h3>
            <div className="m-faq-a" id={`mfa${i}`} role="region" aria-labelledby={`mfq${i}`}>
              <div><p>{a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
