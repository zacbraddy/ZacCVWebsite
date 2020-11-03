import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import styled, { keyframes } from 'styled-components';

import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';
import LoadingSpinner from '../components/loading-spinner';

const fadeUpIn = keyframes`
  from {
    transform: translateY(1rem);
    opacity: 0;
  }

  to {
    transform: none;
    opacity: 1
  }
`;

const Container = styled.div`
  animation: ${fadeUpIn} 0.5s linear 1;
`;

const IndexPage = () => {
  const [loading, setLoading] = useState(true);

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
      <Container className="transition bg-primary rounded h-full">
        Zac
      </Container>
    </Layout>
  );
};

export default IndexPage;
