import type { Metadata } from 'next';
import { Permanent_Marker, Roboto } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { config as faConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import { Providers } from './providers';
import { ThemeToggle } from '@/components/atoms/theme-toggle';
import ContentTransition from '@/components/molecules/content-transition';
import NavLinks from '@/components/molecules/nav-links';
import PortraitImage from '@/components/atoms/portrait-image';
import Socials from '@/components/molecules/socials';
import config from '@/config';
import styles from '@/components/layout.module.css';

faConfig.autoAddCss = false;

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-permanent-marker',
  display: 'swap',
});

const description =
  "This guy codes. Like really! Also he's friendly, a solid architect and mentor to boot. Why not see what else he can do on his CV website?";

export const metadata: Metadata = {
  metadataBase: new URL('https://zackerthehacker.com'),
  title: {
    default: 'Zac Braddy - CV website',
    template: '%s - Zac Braddy',
  },
  description,
  openGraph: {
    title: 'Zac Braddy - CV website',
    description,
    url: 'https://zackerthehacker.com',
    images: ['/images/zac-portrait.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@zackerthehacker',
    title: 'Zac Braddy - CV website',
    description,
    images: ['/images/zac-portrait.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${permanentMarker.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <ThemeToggle />
          <main className="p-2 h-screen">
            <div className="h-full lg:flex lg:items-center font-sans xl:mx-auto">
              <div
                className={`${styles.animatedContainer} ${styles.container} transition h-full pt-4 lg:pt-0 lg:flex lg:flex-grow lg:mx-auto max-w-screen-lg xl:max-w-screen-xl`}
              >
                <div
                  className={`${styles.hero} flex flex-col items-center rounded-l lg:grid lg:grid-rows-2 lg:pt-16 lg:gap-0 lg:flex-grow-0 lg:w-72 lg:bg-primary-200 lg:overflow-hidden`}
                >
                  <div className="grid grid-rows-2 gap-8 lg:mt-16 xl:mt-0">
                    <div className="w-68 flex justify-center">
                      <PortraitImage />
                    </div>
                    <div className="hidden text-lg w-68 flex-col items-center lg:flex">
                      <div>Zac Braddy</div>
                      <div>{config.JOB_TITLE}</div>
                      <Socials />
                    </div>
                  </div>
                  <nav className="pt-8 mr-3.5 xl:mr-0 lg:pt-0 justify-start flex-col h-full items-center hidden lg:flex">
                    <NavLinks />
                  </nav>
                </div>
                <div className="pt-16 mb-4 mx-auto bg-primary-400 rounded h-full max-w-screen-md overflow-hidden sm:mb-2 md:pt-24 lg:flex-grow lg:pt-0 xl:max-w-screen-lg">
                  <ContentTransition>{children}</ContentTransition>
                </div>
              </div>
            </div>
          </main>
        </Providers>
        <GoogleAnalytics gaId="G-F98QXJC4S0" />
      </body>
    </html>
  );
}
