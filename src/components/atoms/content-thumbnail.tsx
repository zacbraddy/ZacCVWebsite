import Image from 'next/image';

const THUMBNAILS: Record<
  string,
  { src: string; width: number; height: number }
> = {
  tabsAndSpaces: {
    src: '/images/tabs-and-spaces.jpg',
    width: 1500,
    height: 1500,
  },
  course: { src: '/images/course.jpg', width: 360, height: 450 },
  conferenceTalks: {
    src: '/images/conference-talks.jpg',
    width: 280,
    height: 158,
  },
  podcastGuest: { src: '/images/podcast-guest.jpg', width: 600, height: 314 },
  youtube: { src: '/images/youtube.jpg', width: 144, height: 144 },
  medium: { src: '/images/medium.jpg', width: 144, height: 144 },
};

const ContentThumbnail = ({ imageName }: { imageName: string }) => {
  const thumb = THUMBNAILS[imageName];
  if (!thumb) {
    return (
      <div>{`Oops, this was supposed to be a photo of the ${imageName} thumbnail:S`}</div>
    );
  }
  return (
    <Image
      src={thumb.src}
      alt=""
      width={thumb.width}
      height={thumb.height}
      sizes="(min-width: 768px) 192px, 300px"
      className="w-full max-w-[300px] h-auto object-cover md:h-full md:w-48 md:max-w-none"
    />
  );
};
export default ContentThumbnail;
