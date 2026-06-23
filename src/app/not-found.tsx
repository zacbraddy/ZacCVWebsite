import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: '404: Not found - Zac Braddy' },
};

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4">
        404: Not Found
      </h1>
      <p className="text-tertiary sm:text-2xl text-center">
        You just hit a route that doesn&apos;t exist...the sadness...
      </p>
    </div>
  );
}
