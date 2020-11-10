import React from 'react';
import TestimonialPortrait from '../atoms/testimonial-portrait';

export default ({ portraitName, children, author, jobTitle, company }) => (
  <div className="panel w-64 h-94 lg:w-94 lg:h-80">
    <div className="anchor flex flex-col h-full">
      <div className="flex flex-col">
        <TestimonialPortrait portraitName={portraitName} />
        <div className="flex flex-col text-sm italic border-2 border-secondary rounded p-2 pt-16 h-87 lg:h-68">
          {children}
          <div
            class="self-start lg:self-end not-italic font-bold text-secondary absolute break-words"
            style={{ bottom: '1rem' }}
          >
            {`- ${author}${jobTitle ? `, ${jobTitle}` : ''}${
              company ? `, ${company}` : ''
            }`}
          </div>
        </div>
      </div>
    </div>
  </div>
);
