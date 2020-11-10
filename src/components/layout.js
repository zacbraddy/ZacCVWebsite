import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { slide as Menu } from 'react-burger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Scrollbar from 'react-custom-scroll';
import '../../node_modules/react-custom-scroll/dist/customScroll.css';

import Theme from './theme';
import SEO from './seo';
import PortraitImage from './atoms/portrait-image';
import Socials from './molecules/socials';
import LoadingSpinner from './atoms/loading-spinner';
import NavLinks from './molecules/nav-links';
import AnimateOnChange from './atoms/animate-on-change';
import { container, hero } from './layout.module.css';
import './layout.css';

const fadeUpIn = keyframes`
  from {
    transform: translateY(1rem);
    opacity: 0;
  }

  to {
    transform: none;
    opacity: 1
  }
`;

const AnimatedContainer = styled.div`
  animation: ${fadeUpIn} 0.5s linear 1;
`;

export default ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoading(false);
      return;
    }

    document.addEventListener('readystatechange', event => {
      if (document.readyState === 'complete') setLoading(false);
    });
  }, []);

  return loading ? (
    <>
      <LoadingSpinner />
    </>
  ) : (
    <>
      <Theme />
      <div className="lg:hidden">
        <Menu
          customBurgerIcon={
            <FontAwesomeIcon
              className="text-gray-100"
              style={{ width: 'auto' }}
              icon={faBars}
            />
          }
          right
          isOpen={menuOpen}
          onStateChange={({ isOpen }) => setMenuOpen(isOpen)}
        >
          <NavLinks onClick={() => setMenuOpen(false)} />
        </Menu>
      </div>
      <main className="p-2 h-screen">
        <div className="h-full lg:flex lg:items-center font-sans xl:mx-auto">
          <AnimatedContainer
            className={`${container} transition h-full pt-4 lg:pt-0 lg:flex lg:flex-grow lg:mx-auto max-w-screen-lg xl:max-w-screen-xl`}
          >
            <div
              className={`${hero} flex flex-col items-center rounded-l lg:grid lg:grid-rows-2 lg:pt-16 lg:gap-0 lg:flex-grow-0 lg:w-72 lg:bg-primary-200 lg:overflow-hidden`}
            >
              <div className="grid grid-rows-2 gap-8 lg:mt-16 xl:mt-0">
                <div className="w-68 flex justify-center">
                  <PortraitImage />
                </div>
                <div className="hidden text-lg w-68 flex-col items-center lg:flex">
                  <div>Zac Braddy</div>
                  <div>Lead Software Engineer</div>
                  <Socials />
                </div>
              </div>
              <nav className="mt-8 xl:mt-0 justify-start flex-col h-full items-center hidden lg:flex">
                <NavLinks />
              </nav>
            </div>
            <div
              className={`pt-16 mb-4 bg-primary-400 rounded h-full max-w-screen-md overflow-hidden sm:mb-2 md:pt-24 lg:flex-grow lg:pt-0 xl:max-w-screen-lg`}
            >
              <AnimateOnChange
                className="h-full w-full"
                animationIn="fadeInUp"
                animationOut="bounceOut"
                durationIn="100"
                durationOut="100"
              >
                <Scrollbar heightRelativeToParent="calc(100% - 20px)">
                  {children}
                </Scrollbar>
              </AnimateOnChange>
            </div>
          </AnimatedContainer>
        </div>
      </main>
    </>
  );
};
