import Pill from '@/components/atoms/pill';

const SkillsList = ({ skills }: { skills: string[] }) => (
  <div className="flex flex-flow-col flex-wrap">
    {[...skills].sort().map((s, i) => (
      <Pill key={i}>{s}</Pill>
    ))}
  </div>
);
export default SkillsList;
