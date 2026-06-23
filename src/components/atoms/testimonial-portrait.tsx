import Image from 'next/image';
import styles from './testimonial-portrait.module.css';

const PORTRAITS: Record<string, string> = {
  TravisScholes: '/images/travis-scholes.jpg',
  AllenUnderwood: '/images/allen-underwood.jpg',
  GeorgiaShaw: '/images/georgia-shaw.jpg',
  JayMiller: '/images/jay-miller.jpg',
  JoeZack: '/images/joe-zack.jpg',
  JamieTaylor: '/images/jamie-taylor.jpg',
};

const TestimonialPortrait = ({ portraitName }: { portraitName: string }) => {
  const src = PORTRAITS[portraitName];
  if (!src) {
    return (
      <div>{`Oops, this was supposed to be a photo of ${portraitName} :S`}</div>
    );
  }
  return (
    <div className="flex justify-center">
      <div
        className={`${styles.container} relative z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-inverse shadow-xl`}
      >
        <Image
          src={src}
          alt={portraitName}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
    </div>
  );
};
export default TestimonialPortrait;
