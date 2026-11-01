/* Material Symbols ligature icon (.ms in site.css); decorative unless given a label elsewhere.
   data-nosnippet: the ligature is plain text ("movie", "menu_book"…), so keep it out of Google's result snippets.
   Raw <span className="ms"> elsewhere carry the same attribute. */
export default function Ms({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`ms ${className}`.trim()} aria-hidden="true" data-nosnippet="">
      {name}
    </span>
  );
}
