import React, { useState } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ to, onClick, icon, children }) => {
  const isActive = ({ href, location: { pathname } }) =>
    (href === '/' && pathname === href) ||
    (href !== '/' && pathname.startsWith(href))
      ? setIsCurrent(true)
      : setIsCurrent(false);

  const [isCurrent, setIsCurrent] = useState(false);

  return (
    <div
      className={`flex my-2 xl:mt-0 xl:mb-8 text-lg ${
        isCurrent ? 'text-secondary font-bold' : ''
      }`}
    >
      <div className="mr-4">
        <FontAwesomeIcon icon={icon} />
      </div>
      <Link
        className="w-full flex"
        to={to}
        getProps={isActive}
        onClick={onClick}
      >
        {children}
      </Link>
    </div>
  );
};
