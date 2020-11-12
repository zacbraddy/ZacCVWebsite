import React from 'react';

import TimelineItem from '../organisms/timeline-item';

export default () => (
  <div className="overflow-hidden">
    <TimelineItem
      startDate="Jun 2018"
      endDate="Present"
      companyName="Koodoo Mortgages Limited"
      jobTitle="Lead Software Engineer"
      skills={[
        'Javascript',
        'Node JS',
        'Microservices',
        'Moleculer JS',
        'Ramda',
        'Jest',
        'Docker',
        'Kubernetes',
        'GCP',
        'React',
        'Svelte',
        'Tailwind CSS',
        'Joi',
        'Express JS',
        'MacOS',
        'Linux',
        'GNU Make',
        'Storybook',
        'CircleCI',
        'Kustomize',
        'ESLint',
        'Prettier',
        'Webpack',
        'Rollup',
        'Husky',
        'Microfrontends',
        'Single Spa',
      ]}
    >
      <p>
        I joined Koodoo as one of the first four development hires and played
        the role of Lead Software Engineer. During my time there, I worked with
        the team to develop a state of the art microservices system. This system
        allowed Koodoo to take full advantage of their pedigree in the mortgage
        market having pivoted out of other mortgage-related ventures shortly
        after I joined their former company Dynamo.
      </p>
      <p>
        I spent my time at Koodoo creating and cultivating the software
        architecture as well as playing a lead role in implementing it. At the
        same time, the team and I worked to collectively improve our knowledge
        and skill as we gradually improved the software. The result of this was
        a system the was "dressed to impress" when it hit the board rooms of our
        potential customers. We moved quickly at Koodoo, but we took steps to
        secure our future while we did it.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Apr 2017"
      endDate="Jun 2018"
      companyName="RightIndem"
      jobTitle="Principal Developer"
      skills={[
        'C#/.NET',
        'Javascript',
        'Node JS',
        'Jest',
        'Azure',
        'React',
        'Styled Components',
        'SignalR',
        'Windows',
        'Redux',
        'Storybook',
        'CQRS',
        'NUnit',
        'Flow',
        'Prettier',
        'Stylecop',
        'ESLint',
        'SASS',
        'Webpack',
        'Husky',
      ]}
    >
      <p>
        I was brought into RightIndem as a Senior Developer after impressing
        them with my React-based blog "The Reactionary". Shortly before I
        completed my probation, RightIndem saw fit to promote me to Principal
        Developer. In this role, I lead a team of 5 developers who were heading
        up a project whose aim was to greenfield an application using
        leading-edge technology and it needed to be extensible, maintainable,
        robust and delivered on time. We chose to build an Event-driven CQRS
        based system to allow for a sleek and performant system allowing our UX
        experts to design the best possible experience for the user.
      </p>
      <p>
        On top of making decisions around the architecture of the system and
        ensuring the project got delivered on time my role also included several
        aspects of management including hiring new staff, mentoring and
        developing current staff and trying to keep team morale and productivity
        high.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Aug 2016"
      endDate="Apr 2017"
      companyName="E-days Absence Management"
      jobTitle="Senior Web Developer"
      skills={[
        'C#/.NET',
        'Javascript',
        'Octopus Deploy',
        'React',
        'ASP .NET Webforms',
        'Windows',
        'Redux',
        'NUnit',
        'MS SQL Server',
      ]}
    >
      <p>
        E-Days was my first appointment as a Senior Developer, and expectations
        of me were high. I was told that my front end skills would come in handy
        as well as my experience with modern development paradigms. E-days had a
        massive legacy application written in C# using the .NET framework and
        ASP.NET Webforms. As I'd had experience in both working with web forms
        and bringing legacy applications into the modern-day, I was of
        particular interest to E-Days.
      </p>
      <p>
        During my time at E-Days I spent a lot of time learning more deeply the
        technologies that I'd already worked with to ensure that I could not
        just "do", but also "teach" these patterns and practices. I wrote PoCs
        and recommendation documents on overhauling the front end of the
        application using React and Redux. Also, I suggested that we might start
        a slow process of migrating the application to Microservices. Both of
        these involved a vast amount of study and effort done mainly in my own
        time for the love of learning.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Mar 2015"
      endDate="Aug 2016"
      companyName="Trace One"
      jobTitle="Web Developer"
      skills={[
        'C#/.NET',
        'Javascript',
        'Gulp',
        'ASP .NET Classic',
        'VB.NET',
        'NServiceBus',
        'Angular 1',
        'Windows',
        'CQRS',
        'NUnit',
        'SASS',
        'Microservices',
      ]}
    >
      <p>
        Although I was hired as a full-stack web developer my duties upon
        joining and for just under a year were focused heavily in front end
        development, and I invest heavily in the advancement of my front end
        skills during my personal development time as well. This appointment
        happened the middle of the "browser wars" so I learned a lot about the
        front during this time.
      </p>
      <p>
        During my time at Trace One I was also first introduced to the concept
        of microservices and event-driven systems as we began a project to
        overhaul the current architecture with the latest shiny new technology.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Jan 2014"
      endDate="Mar 2015"
      companyName="The Access Group"
      jobTitle="Junior Web Developer"
      skills={[
        'VB.NET/.NET',
        'Javascript',
        'ASP .NET Webforms',
        'JQuery',
        'ASP.NET MVC 4',
        'Telerik',
        'Telerik Kendo',
      ]}
    >
      <p>
        As a Web Developer at Access my duties were to develop one of Access'​
        core products called Focalpoint. This involved both new Development work
        as well as bug fixing and code re-factoring work. Focalpoint also had a
        number of sister applications that act as bolt-ons or standalone
        applications in their own right.
      </p>
      <p>
        This was a very important formative role for me in which I was exposed
        to a wide array varying technologies.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Approx. 2006"
      endDate="Jan 2014"
      companyName="Various"
      jobTitle="Various Technical Roles"
    >
      I've also had several technical roles over the years, including Support
      Team Leader, Support Engineer and others. While I'm happy to share with
      you the details of these on request, they don't relate to my development
      career directly.
    </TimelineItem>
  </div>
);
