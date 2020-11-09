import React from 'react';
import { notInlineContainer } from './timeline-time-company.module.css';

export default ({ startDate, endDate, companyName, inline }) => (
  <div
    className={`mr-4 italic flex flex-col text-sm ${
      inline
        ? 'items-start block lg:hidden'
        : `${notInlineContainer} items-end hidden lg:block`
    }`}
  >
    <div className="font-bold">{`${startDate}${
      endDate ? ` - ${endDate}` : ''
    }`}</div>
    <div>{companyName}</div>
  </div>
);
