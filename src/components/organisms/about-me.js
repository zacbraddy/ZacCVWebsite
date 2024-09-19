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
          Hello! I'm currently seeking a challenging role as a Principal
          Engineer, where I can leverage my{' '}
          <Highlight>extensive experience</Highlight> and drive for technical
          excellence to make a <Highlight>significant impact</Highlight>. With a
          background deeply rooted in coding and{' '}
          <Highlight>proven success in tech leadership</Highlight>, including a
          tenure as a CTO, I possess the expertise to spearhead software
          solutions from ideation to execution. My versatility allows me to
          seamlessly transition between roles, whether as a CTO or founding
          developer, ensuring optimal technical achievement.
        </p>
        <br />
        <p>
          Having immersed myself{' '}
          <Highlight>exclusively in startup environments since 2017</Highlight>,
          I possess an intimate understanding of the unique dynamics and demands
          inherent in such ecosystems. My unwavering commitment to timely
          delivery and my ability to foster collaborative, high-performing teams
          underscore my capacity to{' '}
          <Highlight>deliver tangible results</Highlight>. Drawing upon a
          diverse skill set, I excel in software architecture, requirements
          analysis, and effective communication, ensuring alignment between
          technical solutions and strategic business goals.
        </p>
        <br />
        <p>
          <Highlight>
            As a proactive self-starter with a collaborative mindset
          </Highlight>
          , I am primed to drive innovation and contribute significantly to your
          organization's growth and success. If you're seeking a dedicated
          Principal Engineer to elevate your technical endeavors, I'd love to
          explore potential opportunities for collaboration. Let's connect and
          discuss how I can help propel your team to new heights
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
