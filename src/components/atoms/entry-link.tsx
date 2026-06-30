import Link from 'next/link';

import styles from './entry-link.module.css';

const EntryLink = () => (
  <Link href="/backroom" className={`text-primary ${styles.entryLink}`}>
    More interested in how this site is built? →
  </Link>
);

export default EntryLink;
