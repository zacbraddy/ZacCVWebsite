import TimelineItem from '@/components/organisms/timeline-item';

const Experience = () => (
  <div className="overflow-hidden">
    <TimelineItem
      startDate="Mar 2026"
      endDate="Present"
      companyName="Prolific Academics Ltd"
      jobTitle="Senior Software Engineer (Contract)"
      skills={[
        'AWS',
        'Datadog',
        'Django',
        'Fast API',
        'Github Actions',
        'Linux',
        'Python',
        'Terraform',
      ]}
    >
      <p>
        At Prolific, I was brought in to give their freshly modernised
        Enterprise Payments System the observability it deserved, building a
        production-ready MVP from scratch. I delivered dashboards tracking the
        golden metrics across every payment flow for proactive monitoring, plus
        anomaly-driven alerts for the moments things go sideways. The
        instrumentation spanned both the legacy Django monolith and the new
        FastAPI system, giving clear reporting on performance, errors and
        throughput across the whole estate. And rather than clicking around in
        the Datadog UI, I shipped it all as version-controlled Terraform
        deployed through GitHub Actions, so every dashboard and alert is
        reviewable, repeatable and built to last.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Sep 2025"
      endDate="Feb 2026"
      companyName="Subly"
      jobTitle="Senior Software Engineer (Node-AI)"
      skills={[
        'AWS',
        'Express JS',
        'FFmpeg',
        'Gemini',
        'GPT-4o',
        'Javascript',
        'Node JS',
        'OpenCV',
        'PaddleOCR',
        'React',
        'Typescript',
        'Vercel AI SDK',
      ]}
    >
      <p>
        At Subly, I took their WCAG video-accessibility analyser from a
        best-guess reporting tool into something that actually nails it:
        accurate violation detection, clear descriptions, and genuinely
        actionable remediation guidance. Along the way I squeezed a 4&times;
        performance gain out of the video-analysis pipeline, dragging it from
        26&times; video length down to a much friendlier 6&times;. A big chunk
        of that came from re-engineering the GPT-4o and Gemini integrations
        through sharper prompt engineering, smarter context management and
        better tool-use patterns, which lifted both accuracy and consistency. I
        also rapidly up-skilled in FFmpeg, OpenCV and PaddleOCR to optimise the
        video and image pipelines, because the best tool for the job beats the
        familiar one every time.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Nov 2024"
      endDate="Jun 2025"
      companyName="Flocast"
      jobTitle="Technical Co-Founder (Node-React)"
      skills={[
        'AWS',
        'Github Actions',
        'NestJS',
        'Node JS',
        'QuickBooks',
        'React',
        'Refine',
        'Render',
        'Stripe',
        'Typescript',
        'Xero',
      ]}
    >
      <p>
        At Flocast, I built a complete fintech product from concept to paying
        customers in just five months as the sole technical resource: a NestJS
        backend, a Refine frontend, hosted on Render and AWS with full CI/CD
        through GitHub Actions. The heart of it was the financial data, so I
        architected the integrations with Xero, QuickBooks and Stripe that the
        whole product was built around. I also acted as de facto CTO for a
        non-technical co-founder, translating big business ambitions into a
        workable technical strategy, managing scope, and making pragmatic
        architecture calls that prioritised speed to market. I carefully picked
        the stack so we were working with the best tools for the job, despite
        some of them being unfamiliar to me, and shipped a working proof of
        concept in the first month that went on to become the production MVP. A
        few more months and we were seeing paying customers starting to make
        their way to the platform!
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="May 2021"
      endDate="Apr 2024"
      companyName="Odondo Ltd"
      jobTitle="Chief Technology Officer (Python-React)"
      skills={[
        'AWS',
        'Docker',
        'Django',
        'ESLint',
        'Fast API',
        'GNU Make',
        'Github Actions',
        'Husky',
        'Javascript',
        'Jest',
        'Lambdas',
        'Linux',
        'Poetry',
        'Prettier',
        'Pytest',
        'Python',
        'Ramda',
        'React',
        'Rollup',
        'Storybook',
        'Terraform',
        'Webpack',
        'Vite',
      ]}
    >
      <p>
        At Odondo, I took on the challenge of fixing their Django monolith and
        boy, did I deliver! With the COO by my side, I mapped out a plan for
        success and dove headfirst into the code. Despite the headaches and
        obstacles, I kept my cool and kept cranking out top-notch software.
      </p>
      <p>
        To revamp their system, I built an anti-corruption layer around the old
        code and slowly but surely transitioned to a shiny new system. The
        result? Odondo had a reliable Fast API backend system utilizing AWS
        CloudWatch, Lambdas, and SQS. On the frontend, I created three React SPA
        applications tailored to each customer type that Odondo serviced. And to
        make sure everything ran like a well-oiled machine, I implemented
        rock-solid Github actions CI/CD pipelines and terraform modules.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Feb 2021"
      endDate="May 2023"
      companyName="Zarosoft Ltd"
      jobTitle="Director/Contract Software Engineer"
      skills={[
        'AWS',
        'Docker',
        'ESLint',
        'Express JS',
        'Fast API',
        'Flask',
        'GCP',
        'GNU Make',
        'Github Actions',
        'Husky',
        'Javascript',
        'Jest',
        'Kubernetes',
        'Lambdas',
        'Linux',
        'MacOS',
        'Microfrontends',
        'Microservices',
        'Moleculer JS',
        'Node JS',
        'Poetry',
        'Prettier',
        'Pytest',
        'Python',
        'Ramda',
        'React',
        'Rollup',
        'Single Spa',
        'Storybook',
        'Svelte',
        'Tailwind CSS',
        'Terraform',
        'Webpack',
        'Vite',
      ]}
    >
      <p>
        At Zarosoft, we&apos;re all about delivering top-quality software
        solutions on time through our software contracting and consulting
        services. We&apos;re skilled and experienced with a variety of stacks,
        from Node monoliths on Azure to event-driven Python microservices on
        AWS, and everything in between. Whether you need a React SPA or Svelte
        microfrontends for your frontend, we&apos;ve got your back. With our use
        of the latest technologies, we&apos;ll get your new product or feature
        up and running quickly, so you can bring your A-game to the market.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Mar 2021"
      endDate="Apr 2021"
      companyName="Legal and Marketing Services"
      jobTitle="Senior Contract Frontend Developer (React)"
      skills={[
        'Azure Devops',
        'Azure',
        'ESLint',
        'Javascript',
        'Jest',
        'Node JS',
        'Prettier',
        'React',
        'Windows',
      ]}
    >
      <p>
        At LMS, I became the hero of a front-end project that was in dire need
        of rescuing. With a looming deadline and a junior developer who was in
        over their head, I stepped in to save the day without bruising any egos.
      </p>
      <p>
        While we couldn&apos;t implement every improvement we wanted, we were
        able to get the project back on track and deliver on time. By the time I
        left LMS, the junior developer had grown more confident and competent,
        and the front-end solution was in great shape. It was scalable,
        maintainable, and ready to handle whatever the business threw at it.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Jun 2018"
      endDate="Jan 2021"
      companyName="Koodoo Mortgages Limited"
      jobTitle="Lead Software Engineer (Node-React)"
      skills={[
        'CircleCI',
        'Docker',
        'ESLint',
        'Express JS',
        'GCP',
        'GNU Make',
        'Husky',
        'Javascript',
        'Jest',
        'Joi',
        'Kubernetes',
        'Kustomize',
        'Linux',
        'MacOS',
        'Microfrontends',
        'Microservices',
        'Moleculer JS',
        'Node JS',
        'Prettier',
        'Ramda',
        'React',
        'Rollup',
        'Single Spa',
        'Storybook',
        'Svelte',
        'Tailwind CSS',
        'Webpack',
      ]}
    >
      <p>
        When I joined Koodoo, I was one of the first four developers to join the
        team, and was excited to take on the role of Lead Software Engineer.
        Together with the team, we developed a cutting-edge microservices system
        that leveraged Koodoo&apos;s expertise in the mortgage market - they had
        recently pivoted from other mortgage-related ventures after I joined
        their former company, Dynamo.
      </p>
      <p>
        At Koodoo, I spent my days crafting and refining the software
        architecture, while also taking the lead on its implementation.
        Alongside my team, we constantly worked to level up our skills and
        knowledge, chipping away at the software to make it better every day.
        The result was a system that was as sharp as a three-piece suit when it
        hit the board rooms of our potential customers. We moved fast and got
        things done, all while taking care to ensure we were building a secure
        future for ourselves.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="Apr 2017"
      endDate="Jun 2018"
      companyName="RightIndem"
      jobTitle="Principal Developer"
      skills={[
        'Azure',
        'C#/.NET',
        'CQRS',
        'ESLint',
        'Flow',
        'Husky',
        'Javascript',
        'Jest',
        'NUnit',
        'Node JS',
        'Prettier',
        'React',
        'Redux',
        'SASS',
        'SignalR',
        'Storybook',
        'Stylecop',
        'Styled Components',
        'Webpack',
        'Windows',
      ]}
    >
      <p>
        During my time at RightIndem as Principal Developer, I was responsible
        for leading a team of five developers on a greenfield project alongside
        the two other teams in the company. The goal was to build an application
        using cutting-edge technology that was extensible, maintainable, and
        delivered on time. To achieve this, we chose to build an event-driven
        CQRS-based system, which allowed for a sleek and performant user
        experience.
      </p>
      <p>
        In addition to making key decisions around the architecture and ensuring
        timely delivery, I also managed several aspects of the project,
        including hiring new staff, mentoring and developing current staff, and
        maintaining team morale and productivity. Overall, it was a challenging
        yet fulfilling experience, and I&apos;m proud of the results we achieved
        as a team.
      </p>
    </TimelineItem>
    <TimelineItem
      startDate="2007"
      endDate="Mar 2017"
      companyName="Various"
      jobTitle="Various Technical Roles"
    >
      <p>
        Are you ready for some tech talk? I&apos;ve had a ton of experience in
        software development, and I&apos;m excited to chat with you about it. It
        hasn&apos;t all been just development, from support team leader to
        systems management engineer and other technical roles, I&apos;ve seen it
        all. And if you&apos;re interested, I&apos;d be happy to give you the
        details! But I don&apos;t want to bore you with my whole history.
        Let&apos;s focus on the good stuff, like my current expertise in
        software development. So, let&apos;s grab a coffee and nerd out about
        tech!
      </p>
    </TimelineItem>
  </div>
);
export default Experience;
