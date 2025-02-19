import { useRef} from 'react';

// Types
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import { BrefHit } from '@/app/types';

const AnimatedPreview = ({ hit }: { hit: AlgoliaHit<BrefHit> }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animatedUrl = hit.thumbnail.animatedUrl;
  const videoElement = videoRef.current as HTMLVideoElement;

  const onMouseEnter = () => {
    if (!videoElement) return;

    videoElement.play();
  };
  const onMouseLeave = () => {
    if (!videoElement) return;

    videoElement.pause();
    videoElement.currentTime = 0;
  };

  return (
    <video 
      ref={videoRef}
      playsInline
      loop
      muted
      width="100%" 
      height="auto" 
      className="absolute z-10 invisible group-hover:visible"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <source src={animatedUrl} type="video/mp4" />
    </video>
  );
};

export default AnimatedPreview;
