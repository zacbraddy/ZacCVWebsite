import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

export default () => (
  <div className="grid grid-cols-3 gap-4 mt-4">
    <a href="https://twitter.com/ZackerTheHacker" target="_blank">
      <FontAwesomeIcon icon={faTwitter} size="lg" />
    </a>
    <a href="https://www.linkedin.com/in/zac-braddy-17a81b22/" target="_blank">
      <FontAwesomeIcon icon={faLinkedin} size="lg" />
    </a>
    <a href="https://github.com/zacbraddy" target="_blank">
      <FontAwesomeIcon icon={faGithub} size="lg" />
    </a>
  </div>
);
