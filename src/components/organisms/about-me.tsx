import StatRow from '@/components/atoms/stat-row';
import Heading from '@/components/atoms/heading';
import Highlight from '@/components/atoms/highlight';

const AboutMe = () => (
  <>
    <Heading>
      About <span className="text-secondary">Me</span>
    </Heading>
    <div className="ml-4 lg:mx-8 grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 flex flex-col gap-8">
        <p>
          I&apos;m a 0-to-1 builder and system modernisation specialist. I take
          startups from an idea to paying customers, and I rescue post-PMF
          codebases that are buckling under their own growth. I&apos;ve been
          shipping software professionally for 13 years with the last 8
          exclusively in early-stage startups, see me frequently working as the
          primary technical resource who owns delivery end to end.
        </p>

        <ul className="flex flex-col gap-8">
          <li>
            <Highlight>Building from 0 to 1</Highlight>: I take the ideas of my
            clients and the founders that I work with founders from concept to
            working software, fast. At Flocast I built a complete fintech
            product from idea to paying customers in five months as the sole
            technical resource, picking the right stack for the job and shipping
            a proof of concept in the first month that became the production
            MVP.
          </li>

          <li>
            <Highlight>Modernising to the rescue!</Highlight>: If your post-PMF
            MVP is starting to creak under the pressure of your success I&apos;m
            here to help you save it. At Odondo I modernised a legacy Django
            monolith into a FastAPI and domain-driven architecture over three
            years as the sole technical resource I had the difficult task of
            keeping the business running while rebuilding the foundations
            beneath it.
          </li>
          <li>
            <Highlight>Building with strategy in mind</Highlight>: I make
            architectural decisions that compound rather than constrain: the
            trade-offs that keep a young product moving fast today without
            painting it into a corner tomorrow. The way I see it strategy
            isn&apos;t a separate deliverable it&apos;s baked into how I build.
          </li>

          <li>
            <Highlight>AI-augmented delivery</Highlight>: I work AI-augmented as
            a core part of my workflow, with custom LLM-powered toolkits and
            agentic coding, which lets me deliver at a pace that usually needs a
            larger team. But LLMs alone aren&apos;t enough to build software
            ready to withstand the slings and arrows of production traffic. With
            me driving that LLM I&apos;m able to ensure that real productivity
            gains are realised by leveraging my strong development experience
            ensuring that you don&apos;t have a technical solution driving at
            great velocity towards a wall!
          </li>
        </ul>

        <p>
          Whether you need a product built from scratch or a codebase pulled
          back from the brink, I go in and build — owning delivery from the
          first commit to shipped, working software.
        </p>
      </div>
      <div>
        <div className="sm:grid sm:grid-cols-2 lg:block">
          <div className="grid grid-rows-6">
            <StatRow subject="Age" value="41" />
            <StatRow subject="Residence" value="Nottingham, UK" />
            <StatRow subject="Nationality" value="Australian" />
            <StatRow subject="Citizenship" value="Australian + British" />
            <StatRow subject="Phone" value="+447450 587 400" />
            <StatRow subject="Email" value="zac&#0064;werightcode.com" />
          </div>
        </div>
      </div>
    </div>
  </>
);
export default AboutMe;
