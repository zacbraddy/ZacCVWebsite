'use client';

import { createContext, useContext, useState } from 'react';

type MenuOpenContextValue = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

export const MenuOpenContext = createContext<MenuOpenContextValue>({
  menuOpen: false,
  setMenuOpen: () => {},
});

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MenuOpenContext.Provider value={{ menuOpen, setMenuOpen }}>
      {children}
    </MenuOpenContext.Provider>
  );
};

export const useMenuOpen = () => useContext(MenuOpenContext);
