import { useRef } from 'react';

// Types
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import { BrefHit } from '@/app/types';

const AnimatedPreview = ({ hit }: { hit: AlgoliaHit<BrefHit> }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animatedUrl = hit.thumbnail.animatedUrl;

  const onMouseEnter = async () => {
    if (!videoRef.current) return;

    /* eslint-disable @typescript-eslint/no-unused-vars */
    try {
      await videoRef.current.play();
    } catch (err) {
      // Ignore the error. It happens when trying to play two different videos
      // at the same time.
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
  };
  const onMouseLeave = () => {
    if (!videoRef.current) return;

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <video
      ref={videoRef}
      playsInline
      loop
      muted
      width="100%"
      height="auto"
      className="absolute z-[8] opacity-0 transition-opacity group-hover:opacity-100 pointer-events-[all]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <source src={animatedUrl} type="video/mp4" />
    </video>
  );
};

export default AnimatedPreview;
