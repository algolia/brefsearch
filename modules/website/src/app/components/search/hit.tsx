import { Clock, Eye } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import Subtitle from '../subtitles';
import AnimatedPreview from './animatedPreview';

// Types
import { BrefHit } from '@/app/types';
import { VideoData } from '../modal';

const CustomHit = ({
  hit,
  hitIndex,
  setVideoData,
}: {
  hit: AlgoliaHit<BrefHit>;
  hitIndex: number;
  setVideoData: (value: VideoData) => void;
}) => {
  const [isMouseNear, setIsMouseNear] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const priority = hitIndex <= 6;

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

  const thumbnailUrl = `https://res.cloudinary.com/det9vl8xp/image/fetch/f_jpg/q_auto/fl_progressive:steep/w_900/${hit.thumbnail.url}`;

  return (
    <div
      key={hit.objectID}
      className="relative w-full bg-slate-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl z-[1]"
    >
      <div
        role="button"
        className="clip block relative aspect-video"
        onClick={() => setVideoData({
          videoId: hit.episode.videoId,
          timestamp: hit.line.start,
          title: `${hit.episode.index}. ${hit.episode.name}`,
          lqip: hit.thumbnail.lqip,
        })}
      >
        {/* Image */}
        <div ref={ref} className="relative w-full h-full group overflow-hidden">
          {/* Animated preview inserted when cursor is near */}
          {isMouseNear && <AnimatedPreview hit={hit} />}

          {/* LQIP Background always displayed */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${hit.thumbnail.lqip})`,
              filter: 'blur(8px)',
            }}
          />

          {/* High Quality Image with smooth transition */}
          <Image
            src={thumbnailUrl}
            alt={hit.episode.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />

          <Subtitle hit={hit} />
        </div>

        {/* Metadata */}
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
    </div>
  );
};

export default CustomHit;
