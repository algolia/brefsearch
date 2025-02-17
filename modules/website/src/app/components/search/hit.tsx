import { Clock, Eye } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Subtitle from '../subtitles';
import AnimatedPreview from './animatedPreview';
import Image from 'next/image';

// Types
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import { BrefHit } from '@/app/types';

const CustomHit = ({
  hit,
  setSelectedVideo,
}: {
  hit: AlgoliaHit<BrefHit>;
  setSelectedVideo: (value: BrefHit) => void;
  selectedVideo: boolean;
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isMouseNear, setIsMouseNear] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Observer for lazy loading below the fold
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Check if mouse is near the hit
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!ref.current) return;
      if (isMouseNear) return;

        const { clientX, clientY } = event;
        const hitElement = ref.current.getBoundingClientRect();
        const buffer = 100; // Buffer in px around the element

        const isNear =
          clientX > hitElement.left - buffer &&
          clientX < hitElement.right + buffer &&
          clientY > hitElement.top - buffer &&
          clientY < hitElement.bottom + buffer;

        if (isNear) {
          setIsMouseNear(true);
        }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isMouseNear]);

  return (
    <div
      key={hit.objectID}
      className="relative w-full bg-slate-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <div
        role="button"
        className="clip block relative aspect-video"
        onClick={() => setSelectedVideo(hit)}
      >
        <div ref={ref} className="relative w-full h-full group">
          {/* Hover GIF */}
          {isMouseNear && (
            <AnimatedPreview
              hit={hit}
            />
          )}

          {/* Static Thumbnail (Lazy-loaded below the fold) */}
          {true && hit.thumbnail.url && (
            <Image
              src={hit.thumbnail.url || '/placeholder.svg'}
              alt={hit.episode.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={hit.thumbnail.lqip}
              priority={isInView}
              loading={isInView ? undefined : 'lazy'}
              loader={({ src }) =>
                `https://res.cloudinary.com/det9vl8xp/image/fetch/f_auto/q_auto/${src}`
              }
            />
          )}

          <Subtitle hit={hit} />
        </div>
      </div>
      <div className="p-4">
        <h2 className="font-bold text-lg mb-2 text-white dark:text-gray-200 line-clamp-2">
          {hit.episode.index}. {hit.episode.name}
        </h2>
        <div className="flex items-center text-sm text-white dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>{hit.episode.durationHuman}</span>
          <Eye className="w-4 h-4 ml-4 mr-1" />
          <span>
            {hit.episode.viewCount && hit.episode.viewCount.toLocaleString()}{' '}
            vues
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomHit;
