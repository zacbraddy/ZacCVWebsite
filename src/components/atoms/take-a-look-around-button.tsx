'use client';

import { useMenuOpen } from '@/context/menu-open-context';

const TakeALookAroundButton = () => {
  const { setMenuOpen } = useMenuOpen();

  return (
    <button
      type="button"
      className="lg:hidden font-bold text-md border-4 rounded-full px-4 py-2 text-secondary border-secondary flex mx-auto mt-8"
      onClick={() => setMenuOpen(true)}
    >
      Take a look around
    </button>
  );
};

export default TakeALookAroundButton;
