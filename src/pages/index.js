import React, { useState, useEffect, useContext } from 'react';
import Seo from '../components/seo';

import AnimateOnChange from '../components/atoms/animate-on-change';
import { MenuOpenContext } from '../components/layout';

const JOBTITLES = [
  'Contract Software Engineer',
  'Mutant Code Monkey',
  'Prolific Content Creator',
  'Code Chameleon',
  'Senior Web Developer',
  'Roleplayer',
  'Javascript Enthusiast',
  '1337 Video Gamer',
  'Former .NET Hacker',
];

const IndexPage = () => {
  const [jobTitleIndex, setJobTitleIndex] = useState(0);
  const menuContext = useContext(MenuOpenContext);

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
      <Seo title="Home - Zac Braddy" />
      <div className="pt-32 h-full sm:flex sm:items-center sm:justify-center md:pt-24">
        <div className="flex flex-col justify-center items-center lg:pb-4">
          <h1 className="font-fancy-heading text-4xl text-secondary sm:text-6xl mb-4">
            Zac Braddy
          </h1>
          <AnimateOnChange durationIn={750} durationOut={750}>
            <div className="text-tertiary sm:text-2xl">
              {JOBTITLES[jobTitleIndex]}
            </div>
          </AnimateOnChange>
          <button
            className="lg:hidden font-bold text-md border-4 rounded-full px-4 py-2 text-secondary border-secondary flex mx-auto mt-8"
            onClick={() => menuContext.setMenuOpen(true)}
          >
            Take a look around
          </button>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
