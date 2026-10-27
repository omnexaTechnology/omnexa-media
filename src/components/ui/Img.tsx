import Image, { type ImageProps } from "next/image";
import DIMS from "@/content/media-dims.json";

/* next/image for files in public/assets: intrinsic width/height come from media-dims.json
   (scripts/gen-media-dims.js), so the browser reserves the right box and picks a width-matched AVIF/WebP. */
const dims: Record<string, number[]> = DIMS;
type Props = Omit<ImageProps, "src" | "width" | "height" | "alt"> & { src: string; alt?: string };

export default function Img({ src, alt = "", fill, ...rest }: Props) {
  if (fill) return <Image src={src} alt={alt} fill {...rest} />;
  const [width, height] = dims[src] ?? [1200, 1200];
  return <Image src={src} alt={alt} width={width} height={height} {...rest} />;
}
