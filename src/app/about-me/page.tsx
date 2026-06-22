import type { Metadata } from 'next';
import AboutMe from '@/components/organisms/about-me';
import WhatIDo from '@/components/organisms/what-i-do';
import Testimonials from '@/components/organisms/testimonials';
import ThingsILike from '@/components/organisms/things-i-like';

export const metadata: Metadata = {
  title: 'About Me',
  openGraph: { title: 'About Me - Zac Braddy' },
  twitter: { title: 'About Me - Zac Braddy' },
};

export default function AboutMePage() {
  return (
    <div className="px-4 py-8 grid grid-cols-1 gap-8">
      <AboutMe />
      <WhatIDo />
      <Testimonials />
      <ThingsILike />
    </div>
  );
}
