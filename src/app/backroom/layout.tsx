import Link from 'next/link';

export default function BackroomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-2 min-h-screen">
      <div className="max-w-screen-md mx-auto pt-8">
        <Link href="/" className="text-tertiary hover:text-secondary">
          ◀ back to the site
        </Link>
        <div className="pt-8">{children}</div>
      </div>
    </main>
  );
}
