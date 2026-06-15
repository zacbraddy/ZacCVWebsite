'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type NavLinkProps = {
  to: string;
  onClick?: () => void;
  icon: IconDefinition;
  children: React.ReactNode;
};

const NavLink = ({ to, onClick, icon, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isCurrent =
    (to === '/' && pathname === to) || (to !== '/' && pathname.startsWith(to));

  return (
    <div
      className={`flex my-2 xl:mt-0 xl:mb-8 text-lg ${
        isCurrent ? 'text-secondary font-bold' : ''
      }`}
    >
      <div className="mr-4">
        <FontAwesomeIcon icon={icon} />
      </div>
      <Link className="w-full flex" href={to} onClick={onClick}>
        {children}
      </Link>
    </div>
  );
};

export default NavLink;
