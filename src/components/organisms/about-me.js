import React from 'react';
import StatRow from '../atoms/stat-row';
import Heading from '../atoms/heading';
import Highlight from '../atoms/highlight';

const AboutMe = () => (
  <>
    <Heading>
      About <span className="text-secondary">Me</span>
    </Heading>
    <div className="ml-4 lg:mx-8 grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 flex flex-col gap-8">
        <p>
          I'm a seasoned technology leader with a proven track record of success
          in startup environments. I have a deep understanding of the challenges
          and opportunities that come with building software from the ground up,
          and I'm passionate about leading teams to achieve ambitious goals. My
          experience as a CTO, combined with my hands-on engineering background,
          makes me ideally suited to guide the technical vision and execution of
          an early-stage startup.
        </p>

        <ul className="flex flex-col gap-8">
          <li>
            <Highlight>Startup DNA</Highlight>: I've operated exclusively within
            startup environments since 2017, giving me a deep understanding of
            the unique dynamics and demands of these settings. I thrive in
            fast-paced environments where adaptability and resourcefulness are
            essential. My experience at Odondo, where I successfully
            transitioned a legacy Django monolith to a modern, cloud-based
            architecture, demonstrates my ability to navigate technical
            challenges while delivering tangible results.
          </li>

          <li>
            <Highlight>Technical Leadership and Execution</Highlight>: I bring a
            rare blend of strategic vision and hands-on technical expertise. As
            CTO, I've successfully led engineering teams through all stages of
            the software development lifecycle, from ideation to deployment. My
            diverse skillset encompasses software architecture, requirements
            gathering, and effective communication, ensuring alignment between
            technical solutions and business objectives. I'm also a proficient
            coder with experience across various technologies, including Python,
            React, Node.js, and AWS, to name a few.
          </li>
          <li>
            <Highlight>Building High-Performing Teams</Highlight>: I'm a strong
            believer in fostering collaborative and productive team
            environments. I prioritize mentorship and support team members in
            their professional development, as evidenced by testimonials from
            colleagues who have benefited from my guidance. I believe that a
            positive and growth-oriented culture is crucial for attracting and
            retaining top talent.
          </li>

          <li>
            <Highlight>Passion for Innovation and Impact</Highlight>: I'm driven
            by a desire to build innovative products that make a real
            difference. I'm constantly seeking new ways to improve and push the
            boundaries of what's possible with technology. My involvement in the
            developer community through activities like podcasting, conference
            talks, and blog posts reflects my commitment to sharing knowledge
            and fostering a culture of innovation.
          </li>
        </ul>

        <p>
          I'm excited to join an early-stage startup and contribute my
          experience, leadership, and technical skills to build a successful
          company. I'm confident that my passion for innovation and my
          commitment to building high-performing teams will enable us to achieve
          great things together.
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
