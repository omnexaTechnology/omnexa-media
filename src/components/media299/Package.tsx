"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/content/data";
import { COPY } from "@/content/media299";
import { waHref } from "@/content/site";
import { track } from "@/components/layout/Analytics";
import BtnInner from "@/components/ui/BtnInner";
import Ms from "@/components/ui/Ms";

/* /ads quote request: name + mobile, composed into the package WhatsApp message (the site has no backend;
   the booking panel works the same way). */
export function OrderForm() {
  const l = useLocale() as Locale;
  const c = COPY[l], f = c.form;
  const [err, setErr] = useState("");

  const send = (form: HTMLFormElement) => {
    const v = (k: string) => (form.elements.namedItem(k) as HTMLInputElement).value.trim();
    const name = v("name"), phone = v("phone");
    if (!name || phone.replace(/\D/g, "").length < 7) return setErr(f.need);
    setErr("");
    const msg = [c.waText, "", `${f.msgName}: ${name}`, `${f.msgPhone}: ${phone}`].join("\n");
    track("package_request_submit", { service: "media299" }); // no personal data: only that a request was sent
    window.open(waHref(msg), "_blank", "noopener");
  };

  return (
    <form className="m-form" noValidate aria-labelledby="mFormT" onSubmit={(e) => { e.preventDefault(); send(e.currentTarget); }}>
      <h3 id="mFormT">{f.t}</h3>
      <p className="m-form-p">{f.p}</p>
      <label>
        <span>{f.name}</span>
        <span className="m-in"><Ms name="person" /><input name="name" autoComplete="name" required /></span>
      </label>
      <label>
        <span>{f.phone}</span>
        <span className="m-in"><Ms name="call" /><input name="phone" type="tel" dir="ltr" inputMode="tel" autoComplete="tel" required /></span>
      </label>
      <button className="btn btn-primary" type="submit"><BtnInner label={f.send} /></button>
      <p className={err ? "m-err" : "m-note"} role={err ? "alert" : undefined}>{err || f.note}</p>
    </form>
  );
}
