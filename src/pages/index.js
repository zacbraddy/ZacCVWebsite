import React, { useState, useEffect } from 'react';
import SEO from '../components/seo';

import AnimateOnChange from '../components/atoms/animate-on-change';

const JOBTITLES = [
  'Lead Software Engineer',
  'Mutant Code Monkey',
  'Prolific Content Creator',
  'Senior Web Developer',
  'Roleplayer',
  'Javascript Enthusiast',
  '1337 Video Gamer',
  'Former .NET Hacker',
];

const IndexPage = () => {
  const [jobTitleIndex, setJobTitleIndex] = useState(0);

  useEffect(() => {
    const changeJobTitle = setInterval(() => {
      setJobTitleIndex(index =>
        index >= JOBTITLES.length - 1 ? 0 : index + 1
      );
    }, 4000);

    return () => {
      clearInterval(changeJobTitle);
    };
  }, []);

  return (
    <>
      <SEO title="Home - Zac Braddy" />
      <div className="pt-32 h-full sm:flex sm:items-center sm:justify-center md:pt-24">
        <div className="flex flex-col justify-center items-center lg:pb-4">
          <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl">
            Zac Braddy
          </h1>
          <AnimateOnChange durationIn={750} durationOut={750}>
            <div className="text-tertiary sm:text-2xl">
              {JOBTITLES[jobTitleIndex]}
            </div>
          </AnimateOnChange>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
