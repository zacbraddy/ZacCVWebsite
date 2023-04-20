import React from 'react';

import Seo from '../components/seo';

const NotFoundPage = () => (
  <>
    <Seo title="404: Not found" />
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4">
        404: Not Found
      </h1>
      <p className="text-tertiary sm:text-2xl">
        You just hit a route that doesn&#39;t exist...the sadness...
      </p>
    </div>
  </>
);

export default NotFoundPage;
