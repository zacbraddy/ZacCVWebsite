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
          exclusively in early-stage startups, frequently working as the primary
          technical resource who owns delivery end to end.
        </p>

        <ul className="flex flex-col gap-8">
          <li>
            <Highlight>Building from 0 to 1</Highlight>: I take the ideas of my
            clients and the founders that I work with from concept to working
            software, fast. At Flocast I built a complete fintech product from
            idea to paying customers in five months as the sole technical
            resource, picking the right stack for the job and shipping a proof
            of concept in the first month that became the production MVP.
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
            <Highlight>AI-augmented delivery</Highlight>: I&apos;ve gone all in
            on agentic coding, but working with AI agents on client projects I
            kept hitting the same problem. They&apos;re fast, but they lose
            track of the project&apos;s context, chase edge cases nobody asked
            for and leave behind code no one fully understands. So I built{' '}
            <a
              href="https://zacbraddy.github.io/ang"
              rel="noreferrer"
              target="_blank"
              className="text-secondary underline"
            >
              Ang
            </a>
            , my own open-source framework that keeps the AI on the problem at
            hand, keeps humans making the decisions and writes down the why
            behind every choice as the work happens. Where it suits your project
            I bring Ang with me, so you get the speed of AI-augmented delivery,
            a codebase your team can maintain and a written record of the
            reasoning behind every decision when my contract ends!
          </li>
        </ul>

        <p>
          Whether you need a product built from scratch or a codebase pulled
          back from the brink, I go in and build, owning delivery from the first
          commit to shipped, working software.
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
