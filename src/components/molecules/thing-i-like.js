import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ icon, children }) => (
  <div className="lg:flex lg:justify-center">
    <div className="flex flex-col items-center h-48 bg-primary-200 border border-secondary text-secondary rounded justify-center p-2 lg:w-88">
      <FontAwesomeIcon icon={icon} size="2x" />
      <div className="mt-4 font-bold text-lg text-center">{children}</div>
    </div>
  </div>
);
