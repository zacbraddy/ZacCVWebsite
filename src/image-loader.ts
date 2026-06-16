type ImageLoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export default function netlifyImageLoader({
  src,
  width,
  quality,
}: ImageLoaderArgs): string {
  if (process.env.NODE_ENV === 'development') {
    return src;
  }

  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality ?? 75),
  });

  return `/.netlify/images?${params.toString()}`;
}
