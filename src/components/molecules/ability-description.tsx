import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const AbilityDescription = ({
  icon,
  title,
  children,
}: {
  icon: IconDefinition;
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="ml-4 lg:ml-8 grid grid-cols-1 gap-4">
      <FontAwesomeIcon icon={icon} size="2x" className="text-secondary" />
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </div>
  </div>
);
export default AbilityDescription;
