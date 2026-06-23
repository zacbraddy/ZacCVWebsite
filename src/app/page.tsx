import type { Metadata } from 'next';
import RotatingJobTitle from '@/components/molecules/rotating-job-title';
import TakeALookAroundButton from '@/components/atoms/take-a-look-around-button';

export const metadata: Metadata = {
  title: { absolute: 'Home - Zac Braddy' },
  openGraph: {
    title: 'Home - Zac Braddy',
    url: '/',
    images: ['/images/zac-portrait.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@zackerthehacker',
    title: 'Home - Zac Braddy',
    images: ['/images/zac-portrait.jpg'],
  },
};

export default function Home() {
  return (
    <div className="pt-32 h-full sm:flex sm:items-center sm:justify-center md:pt-24">
      <div className="flex flex-col justify-center items-center lg:pb-4">
        <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4">
          Zac Braddy
        </h1>
        <RotatingJobTitle />
        <TakeALookAroundButton />
      </div>
    </div>
  );
}
