import React from 'react';
import {
  faHome,
  faUserAstronaut,
  faStickyNote,
  faPaintBrush,
} from '@fortawesome/free-solid-svg-icons';

import NavLink from '../atoms/nav-link';

const NavLinks = ({ onClick }) => {
  return (
    <>
      <NavLink to="/" onClick={onClick} icon={faHome}>
        Home
      </NavLink>
      <NavLink to="/about-me" onClick={onClick} icon={faUserAstronaut}>
        About Me
      </NavLink>
      <NavLink to="/resume" onClick={onClick} icon={faStickyNote}>
        Resume
      </NavLink>
      <NavLink to="/content" onClick={onClick} icon={faPaintBrush}>
        Content I've Created
      </NavLink>
      <a
        href="/pdfs/zac-braddy.pdf"
        target="_blank"
        rel="noreferrer"
        download
        className="mt-4 font-bold text-lg border-4 rounded-full py-2 px-4 border-secondary self-center"
      >
        Download CV
      </a>
    </>
  );
};
export default NavLinks;
