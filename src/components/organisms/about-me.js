import React from 'react';
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
          Hi there! I'm in pursuit of a dynamic role as an{' '}
          <Highlight>early-stage startup CTO</Highlight>, I bring a{' '}
          <Highlight>
            wealth of experience and a passion for innovation
          </Highlight>{' '}
          to the table. With a strong foundation in coding and a{' '}
          <Highlight>proven track record in tech leadership</Highlight>,
          including a year's tenure as a CTO, I am well-equipped to drive
          software solutions from conception to execution giving me the ability
          to be a duel CTO/Founding developer if need be.
        </p>
        <br />
        <p>
          Having exclusively operated within startup environments since 2017, I
          possess an acute understanding of the unique challenges and pressures
          inherent in such settings. My{' '}
          <Highlight>commitment to timely delivery</Highlight> and my adeptness
          at fostering collaborative, productive team environments underscore my
          ability to deliver tangible results. Drawing upon a diverse skill set,
          I excel in software architecture, requirements gathering, and
          effective communication, ensuring alignment between technical
          solutions and business objectives. As a{' '}
          <Highlight>self-starter with a collaborative spirit</Highlight>, I am
          poised to contribute meaningfully to your organization's growth and
          success.
        </p>
      </div>
      <div>
        <div className="sm:grid sm:grid-cols-2 lg:block">
          <div className="grid grid-rows-6">
            <StatRow subject="Age" value="39" />
            <StatRow subject="Residence" value="Nottingham, UK" />
            <StatRow subject="Nationality" value="Australian" />
            <StatRow subject="Citizenship" value="Australian + British" />
            <StatRow subject="Phone" value="+447450 587 400" />
            <StatRow subject="Email" value="zacharybraddy&#0064;gmail.com" />
          </div>
        </div>
      </div>
    </div>
  </>
);
export default AboutMe;
