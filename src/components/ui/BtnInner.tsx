import Ms from "./Ms";

/* rolling label + icon used inside every .btn (app.js btnInner) */
export default function BtnInner({ label, icon }: { label: string; icon?: string }) {
  const arrow = !icon || /arrow/.test(icon);
  return (
    <>
      <span className="bt">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
      <Ms name={icon || "arrow_forward"} className={arrow ? "arr" : ""} />
    </>
  );
}
