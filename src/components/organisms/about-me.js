import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import StatRow from '../atoms/stat-row';
import Highlight from '../atoms/highlight';
import Heading from '../atoms/heading';

const AboutMe = () => (
  <>
    <Heading>
      About <span className="text-secondary">Me</span>
    </Heading>
    <div className="ml-4 lg:mx-8 grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <p>
          Hi there! I'm Zac Braddy, a Contract Software Engineer with over a
          decade of experience. I'm a <Highlight>coding chameleon</Highlight>{' '}
          who's worked with all sorts of languages and technologies, from .NET
          to Node to Python, and everything in between. I'm{' '}
          <Highlight>super jazzed by great tech</Highlight>, awesome
          architecture, and helping startups deliver these things to market in
          time to capitalize on their opportunities. But at the end of the day,
          what really excites me is working with great teams to deliver{' '}
          <Highlight>quality software that makes a difference!</Highlight> Let's
          have some fun while we make an impact using React, Terraform, AWS, and
          more!
        </p>
      </div>
      <div>
        <div className="sm:grid sm:grid-cols-2 lg:block">
          <div className="grid grid-rows-6">
            <StatRow subject="Age" value="35" />
            <StatRow subject="Residence" value="Nottingham, UK" />
            <StatRow subject="Nationality" value="Australian" />
            <StatRow subject="Citizenship" value="Australian + British" />
            <StatRow subject="Phone" value="+447450 587 400" />
            <StatRow subject="Email" value="zac&#0064;zarosoft.com" />
          </div>
        </div>
      </div>
    </div>
  </>
);
export default AboutMe;
