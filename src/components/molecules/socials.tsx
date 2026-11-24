import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

const Socials = () => (
  <div className="grid grid-cols-3 gap-4 mt-4">
    <a
      href="https://www.linkedin.com/in/🦄-zac-braddy-🦄-17a81b22"
      rel="noreferrer"
      target="_blank"
      aria-label="LinkedIn"
    >
      <FontAwesomeIcon icon={faLinkedin} size="lg" />
    </a>
    <a
      href="https://github.com/zacbraddy"
      rel="noreferrer"
      target="_blank"
      aria-label="GitHub"
    >
      <FontAwesomeIcon icon={faGithub} size="lg" />
    </a>
    <a
      href="https://zacbraddy.github.io/ang"
      rel="noreferrer"
      target="_blank"
      aria-label="Ang"
    >
      <FontAwesomeIcon icon={faScrewdriverWrench} size="lg" />
    </a>
  </div>
);

export default Socials;
