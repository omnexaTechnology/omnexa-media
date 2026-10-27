/* Material Symbols ligature icon (.ms in site.css); decorative unless given a label elsewhere */
export default function Ms({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`ms ${className}`.trim()} aria-hidden="true">
      {name}
    </span>
  );
}
