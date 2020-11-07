import React from 'react';
import {
  faHeart,
  faGamepad,
  faDiceD20,
  faRobot,
} from '@fortawesome/free-solid-svg-icons';

import Heading from '../atoms/heading';
import ThingILike from '../molecules/thing-i-like';

export default () => (
  <>
    <Heading>
      I like to <span className="text-secondary">do</span>
    </Heading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ThingILike icon={faHeart}>Spending time with family</ThingILike>
      <ThingILike icon={faGamepad}>Playing Video Games</ThingILike>
      <ThingILike icon={faDiceD20}>
        Playing Tabletop Roleplaying Games
      </ThingILike>
      <ThingILike icon={faRobot}>Doing fun things with computers</ThingILike>
    </div>
  </>
);
