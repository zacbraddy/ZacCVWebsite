import styles from './timeline-divider.module.css';

const TimelineDivider = ({ className = '' }: { className?: string }) => (
  <div className={`${styles.timelineDivider} ${className}`} />
);
export default TimelineDivider;
