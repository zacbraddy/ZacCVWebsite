import BackLink from '@/components/atoms/back-link';
import BackroomNav from '@/components/organisms/backroom-nav';
import BackroomMobileMenu from '@/components/molecules/backroom-mobile-menu';

export default function BackroomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BackroomMobileMenu>
        <nav aria-label="Backroom documentation">
          <div className="px-3 mb-3">
            <BackLink />
          </div>
          <BackroomNav />
        </nav>
      </BackroomMobileMenu>
      <div className="h-screen overflow-hidden px-2 pb-2 pt-20 lg:p-14">
        <div className="h-full lg:grid lg:grid-cols-[320px_1fr] rounded-md overflow-hidden lg:shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <nav
            aria-label="Backroom documentation"
            className="hidden lg:flex lg:flex-col gap-1.5 bg-primary-200 overflow-y-auto py-[18px]"
          >
            <div className="px-[18px] mb-[14px]">
              <BackLink />
            </div>
            <BackroomNav />
          </nav>
          <main className="h-full bg-primary-400 overflow-y-auto p-4 lg:px-14 lg:py-12">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
