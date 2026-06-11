import React from 'react';

import ContentThumbnail from '../atoms/content-thumbnail';

const ContentItem = ({ link, imageName, title, order = 'left', children }) => (
  <div
    className={`rounded overflow-hidden border border-inverse mb-4 md:h-36 md:w-118 ${
      order === 'right' ? 'md:self-end' : ''
    }`}
  >
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className={`md:flex md:h-full ${
        order === 'right' ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div
        className={`border-b border-inverse md:w-48 md:border-b-0 ${
          order === 'right' ? 'md:border-l' : 'md:border-r'
        }`}
      >
        <ContentThumbnail imageName={imageName} />
      </div>
      <div
        className={`p-2 w-full md:flex md:flex-col md:h-32 ${
          order === 'right' ? 'md:items-end' : ''
        }`}
      >
        <div className="font-bold text-lg">{title}</div>
        <div className="pt-2 italic text-sm">{children}</div>
      </div>
    </a>
  </div>
);
export default ContentItem;
