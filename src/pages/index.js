import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Image from '../components/image';
import SEO from '../components/seo';

const AnimateOnChange =
  typeof window !== 'undefined'
    ? require('react-animation').AnimateOnChange
    : ({ children, ...props }) => React.createElement('div', props, children);

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
    <div className="flex flex-col justify-center items-center mt-8 lg:pb-72">
      <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl">
        Zac Braddy
      </h1>
      <AnimateOnChange durationIn={750} durationOut={750}>
        <div className="text-tertiary sm:text-2xl">
          {JOBTITLES[jobTitleIndex]}
        </div>
      </AnimateOnChange>
    </div>
  );
};

export default IndexPage;
