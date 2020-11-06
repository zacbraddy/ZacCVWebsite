import React from 'react';
import { Link } from 'gatsby';

export default ({ to, isActive, onClick, children }) => (
  <div
    className={`flex my-4 text-lg ${
      isActive(to) ? 'text-secondary font-bold' : ''
    }`}
  >
    <Link className="w-full" to={to} onClick={onClick}>
      {children}
    </Link>
  </div>
);
