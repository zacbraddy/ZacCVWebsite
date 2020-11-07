import React from 'react';
import AboutMe from '../components/organisms/about-me';
import WhatIDo from '../components/organisms/what-i-do';
import Testimonials from '../components/organisms/testimonials';
import ThingsILike from '../components/organisms/things-i-like';

export default () => (
  <div className="px-4 py-8 grid grid-cols-1 gap-8">
    <AboutMe />
    <WhatIDo />
    <Testimonials />
    <ThingsILike />
  </div>
);
