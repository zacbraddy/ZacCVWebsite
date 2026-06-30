import ContentTransition from '@/components/molecules/content-transition';
import NavLinks from '@/components/molecules/nav-links';
import MobileMenu from '@/components/molecules/mobile-menu';
import EntryLink from '@/components/atoms/entry-link';
import PortraitImage from '@/components/atoms/portrait-image';
import Socials from '@/components/molecules/socials';
import config from '@/config';
import styles from '@/components/layout.module.css';

export default function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MobileMenu />
      <div className="fixed bottom-0 left-0 px-8 py-8 z-10">
        <EntryLink />
      </div>
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
    </>
  );
}
