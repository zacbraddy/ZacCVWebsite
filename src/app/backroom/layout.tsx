import BackLink from '@/components/atoms/back-link';

export default function BackroomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-2 min-h-screen">
      <div className="max-w-screen-md mx-auto pt-8">
        <BackLink />
        <div className="pt-8">{children}</div>
      </div>
    </main>
  );
}
