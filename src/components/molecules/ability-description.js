import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ icon, title, children }) => (
  <div>
    <div className="ml-4 lg:ml-8 grid grid-cols-1 gap-4">
      <FontAwesomeIcon icon={icon} size="2x" className="text-secondary" />
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </div>
  </div>
);
