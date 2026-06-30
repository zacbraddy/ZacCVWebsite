import type { Metadata } from 'next';
import { Permanent_Marker, Roboto } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { config as faConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import { Providers } from './providers';
import LoadingSpinner from '@/components/atoms/loading-spinner';
import ConsoleEgg from '@/components/atoms/console-egg';
import { ThemeToggle } from '@/components/atoms/theme-toggle';
import { MenuProvider } from '@/context/menu-open-context';

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
        <LoadingSpinner />
        <ConsoleEgg />
        <Providers>
          <ThemeToggle />
          <MenuProvider>{children}</MenuProvider>
        </Providers>
        <GoogleAnalytics gaId="G-F98QXJC4S0" />
      </body>
    </html>
  );
}
