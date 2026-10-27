/* URL of the next/image-optimised file at one width (must be in next.config deviceSizes/imageSizes),
   for the few <img>s whose src is swapped by script (phone screen, cover-flow background). */
export const optimized = (src: string, w: 384 | 640 | 828 | 1080) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
