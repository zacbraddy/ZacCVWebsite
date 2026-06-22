const StatRow = ({ subject, value }: { subject: string; value: string }) => (
  <div className="flex justify-between w-full">
    <div className="text-secondary font-bold">{subject}</div>
    <div className="text-right">{value}</div>
  </div>
);
export default StatRow;
