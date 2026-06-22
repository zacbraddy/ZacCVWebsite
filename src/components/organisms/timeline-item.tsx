import SkillsList from '@/components/molecules/skills-list';
import TimelineDivider from '@/components/atoms/timeline-divider';
import TimelineTimeCompany from '@/components/atoms/timeline-time-company';

const TimelineItem = ({
  startDate,
  endDate,
  companyName,
  jobTitle,
  skills = [],
  children,
}: {
  startDate: string;
  endDate?: string;
  companyName: string;
  jobTitle?: string;
  skills?: string[];
  children: React.ReactNode;
}) => (
  <div className="flex py-8">
    <TimelineTimeCompany
      startDate={startDate}
      endDate={endDate}
      companyName={companyName}
      inline={false}
    />
    <TimelineDivider className="static py-4 top-0 bottom-0 bg-tertiary" />
    <div className="grid grid-cols-1 gap-4 ml-8">
      <TimelineTimeCompany
        startDate={startDate}
        endDate={endDate}
        companyName={companyName}
        inline={true}
      />
      <div className="font-bold">{jobTitle}</div>
      <div className="grid grid-cols-1 gap-4 ml-4">
        {children}
        <SkillsList skills={skills} />
      </div>
    </div>
  </div>
);
export default TimelineItem;
