import { useHits } from 'react-instantsearch';
import Image from 'next/image';
import { BrefHit } from '@/app/types';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

const Subtitle = ({ hit }: { hit: BrefHit }) => {
  const value = hit._highlightResult.line.content.value;
  return (
    <div className="absolute bottom-4 text-center w-full">
      <div className="text-md bg-black/80 text-white inline-block p-2 rounded-lg max-w-[90%] font-bold">
        <span dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};

const RenderHit = ({ hit }: { hit: AlgoliaHit<BrefHit> }) => {
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const [isGifPreloaded, setIsGifPreloaded] = useState(false);
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

  // Global Mouse Movement Listener to Preload GIF
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isGifPreloaded && ref.current) {
        const { clientX, clientY } = event;
        const hitElement = ref.current.getBoundingClientRect();
        const buffer = 100; // Preload when cursor is within 100px

        const isNear =
          clientX > hitElement.left - buffer &&
          clientX < hitElement.right + buffer &&
          clientY > hitElement.top - buffer &&
          clientY < hitElement.bottom + buffer;

        if (isNear) {
          setIsGifPreloaded(true);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isGifPreloaded]);

  return (
    <Link
      key={hit.objectID}
      className="relative min-h-[340px] w-full"
      href={`https://www.youtube.com/watch?v=${hit.episode.videoId}`}
    >
      <h2 className="font-bold flex">
        <span>🎥 {hit.episode.name}</span>
        <span className="ml-auto text-sm text-gray-500">
          {hit.episode.durationHuman}
        </span>
      </h2>
      <div className="clip grid place-items-center">
        <div
          ref={ref}
          className={cx(
            'relative aspect-video w-full group',
            isGifPreloaded && 'border-2 border-red-500',
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Hover GIF (Preloads before hover) */}
          {hit.thumbnail.gifUrl && isGifPreloaded && (
            <Image
              src={hit.thumbnail.gifUrl}
              alt={hit.episode.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hidden group-hover:block"
              placeholder="blur"
              blurDataURL={hit.thumbnail.lqip}
              priority={false} // Ensure it's never both priority and lazy
              loader={({ src }) =>
                `https://res.cloudinary.com/det9vl8xp/image/fetch/f_auto/q_auto/${src}`
              }
            />
          )}

          {/* Static Thumbnail (Lazy-loaded below the fold) */}
          {hit.thumbnail.url && (
            <Image
              src={hit.thumbnail.url}
              alt={hit.episode.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover block group-hover:hidden"
              placeholder="blur"
              blurDataURL={hit.thumbnail.lqip}
              priority={isInView} // Only prioritize if in view
              loading={isInView ? undefined : 'lazy'} // Avoids conflict
              onLoad={() => setIsThumbnailLoaded(true)}
              loader={({ src }) =>
                `https://res.cloudinary.com/det9vl8xp/image/fetch/f_auto/q_auto/${src}`
              }
            />
          )}

          <Subtitle hit={hit} />
        </div>
      </div>
    </Link>
  );
};

const CustomHits = () => {
  const { results } = useHits();
  const hits = results?.hits as AlgoliaHit<BrefHit>[];

  if (!hits?.length) {
    return <div className="text-center p-4">No results found</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {hits?.map((hit) => <RenderHit key={hit.objectID} hit={hit} />)}
    </div>
  );
};

export default CustomHits;
