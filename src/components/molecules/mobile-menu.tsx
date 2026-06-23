'use client';

import { useEffect } from 'react';
import { Drawer } from 'vaul';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

import NavLinks from './nav-links';
import { useMenuOpen } from '@/context/menu-open-context';
import styles from './mobile-menu.module.css';

const MobileMenu = () => {
  const { menuOpen, setMenuOpen } = useMenuOpen();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const closeAboveLg = () => {
      if (mq.matches) setMenuOpen(false);
    };
    closeAboveLg();
    mq.addEventListener('change', closeAboveLg);
    return () => mq.removeEventListener('change', closeAboveLg);
  }, [setMenuOpen]);

  return (
    <Drawer.Root direction="right" open={menuOpen} onOpenChange={setMenuOpen}>
      <div className="lg:hidden">
        <Drawer.Trigger asChild>
          <button aria-label="Open menu" className={styles.burgerButton}>
            <FontAwesomeIcon
              icon={faBars}
              className="text-gray-100"
              style={{ width: 'auto' }}
            />
          </button>
        </Drawer.Trigger>
      </div>
      <Drawer.Portal>
        <Drawer.Overlay className={`${styles.overlay} lg:hidden`} />
        <Drawer.Content className={`${styles.panel} lg:hidden`}>
          <Drawer.Title className="sr-only">Navigation menu</Drawer.Title>
          <Drawer.Close asChild>
            <button aria-label="Close menu" className={styles.closeButton}>
              <FontAwesomeIcon icon={faXmark} className="text-primary" />
            </button>
          </Drawer.Close>
          <div className={styles.itemList}>
            <NavLinks onClick={() => setMenuOpen(false)} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileMenu;
