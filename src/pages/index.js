import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { AnimateOnChange } from 'react-animation';

import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';
import LoadingSpinner from '../components/atoms/loading-spinner';
import Container from '../components/molecules/container';

const JOBTITLES = [
  'Lead Software Engineer',
  'Mutant Code Monkey',
  'Senior Web Developer',
  'Roleplayer',
  'Javascript Enthusiast',
  '1337 Video Gamer',
  'Former .NET Hacker',
];

const IndexPage = () => {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoading(false);
      return;
    }

    document.addEventListener('readystatechange', event => {
      if (document.readyState === 'complete') setLoading(false);
    });
  }, []);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <Layout>
      <Container>
        <div className="flex flex-col justify-center items-center mt-8">
          <h1 className="text-4xl sm:text-6xl">Zac Braddy</h1>
          <AnimateOnChange durationIn={750} durationOut={750}>
            <div className="sm:text-2xl">{JOBTITLES[jobTitleIndex]}</div>
          </AnimateOnChange>
        </div>
      </Container>
    </Layout>
  );
};

export default IndexPage;
