import styles from './timeline-time-company.module.css';

const TimelineTimeCompany = ({
  startDate,
  endDate,
  companyName,
  inline,
}: {
  startDate: string;
  endDate?: string;
  companyName: string;
  inline: boolean;
}) => (
  <div
    className={`mr-4 italic flex flex-col text-sm ${
      inline
        ? 'items-start block lg:hidden'
        : `${styles.notInlineContainer} items-end hidden lg:block`
    }`}
  >
    <div className="font-bold">{`${startDate}${
      endDate ? ` - ${endDate}` : ''
    }`}</div>
    <div>{companyName}</div>
  </div>
);
export default TimelineTimeCompany;
