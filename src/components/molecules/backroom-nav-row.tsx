'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Doc } from '@velite';

import NumberTile from '@/components/atoms/number-tile';
import GlyphTile from '@/components/atoms/glyph-tile';
import { useMenuOpen } from '@/context/menu-open-context';

type BackroomNavRowProps = {
  href: string;
  title: string;
  teaser: string;
  section: Doc['section'];
  adr?: number;
};

const BackroomNavRow = ({
  href,
  title,
  teaser,
  section,
  adr,
}: BackroomNavRowProps) => {
  const { setMenuOpen } = useMenuOpen();
  const isCurrent = usePathname() === href;

  return (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      aria-current={isCurrent ? 'page' : undefined}
      className={`grid grid-cols-[40px_1fr] gap-3 items-start my-0.5 mx-3 p-[10px_12px] rounded-md border-l-[3px] transition-colors ${
        isCurrent
          ? 'bg-[rgba(4,180,224,0.14)] border-l-[color:var(--color-border-secondary)]'
          : 'border-transparent hover:bg-[rgba(250,250,250,0.06)]'
      }`}
    >
      {section === 'Decisions' && adr !== undefined ? (
        <NumberTile adr={adr} selected={isCurrent} />
      ) : section === 'Overview' ? (
        <GlyphTile glyph="★" selected={isCurrent} />
      ) : (
        <GlyphTile glyph="◆" selected={isCurrent} />
      )}
      <span className="min-w-0">
        <span className="block text-[14px] font-medium leading-[1.25] text-primary">
          {title}
        </span>
        <span className="block text-[12px] leading-[1.3] text-dim mt-[3px]">
          {teaser}
        </span>
      </span>
    </Link>
  );
};

export default BackroomNavRow;
