import React from 'react';
import {
  faHome,
  faUserAstronaut,
  faStickyNote,
  faPaintBrush,
} from '@fortawesome/free-solid-svg-icons';

import NavLink from '../atoms/nav-link';

export default ({ onClick }) => {
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
    </>
  );
};
