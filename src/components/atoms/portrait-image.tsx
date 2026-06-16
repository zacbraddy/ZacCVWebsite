import Image from 'next/image';
import styles from './portrait-image.module.css';

const PortraitImage = () => (
  <div
    className={`${styles.container} relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-inverse shadow-xl`}
  >
    <Image
      src="/images/zac-portrait.jpg"
      alt="Zac Braddy"
      fill
      sizes="(min-width: 768px) 192px, 128px"
      className="object-cover"
    />
  </div>
);

export default PortraitImage;
