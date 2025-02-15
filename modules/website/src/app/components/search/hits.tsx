import { useHits } from 'react-instantsearch';
import Image from 'next/image';
import { BrefHit } from '@/app/types';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import { useEffect, useState } from 'react';

const Subtitle = ({ text }: { text: string }) => {
  return (
    <div className="absolute bottom-4 text-center w-full">
      <div className="text-md bg-black/80 text-white  inline-block p-2 rounded-lg max-w-[90%] font-bold">
        {text}
      </div>
    </div>
  );
};

const RenderHit = ({ hit }: { hit: AlgoliaHit<BrefHit> }) => {
  return (
    <div key={hit.objectID} className="relative min-h-[340px] w-full">
      <h2 className="font-bold">🎥 {hit.episode.name}</h2>
      <div className="clip grid place-items-center">
        <div className="relative aspect-video w-full group">
          {hit.thumbnail.gifUrl && (
            <Image
              src={hit.thumbnail.gifUrl}
              alt={hit.episode.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hidden group-hover:block"
              placeholder="blur"
              blurDataURL={hit.thumbnail.lqip}
              priority
              loader={({ src }) =>
                // add before src
                `https://res.cloudinary.com/det9vl8xp/image/fetch/f_auto/q_auto/${src}`
              }
            />
          )}

          {hit.thumbnail.url && (
            <Image
              src={hit.thumbnail.url}
              alt={hit.episode.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover block group-hover:hidden"
              placeholder="blur"
              blurDataURL={hit.thumbnail.lqip}
              priority={false}
              loader={({ src }) =>
                // add before src
                `https://res.cloudinary.com/det9vl8xp/image/fetch/f_auto/q_auto/${src}`
              }
            />
          )}

          <Subtitle text={hit.line.content} />
        </div>
      </div>
    </div>
  );
};

const CustomHits = () => {
  const { results } = useHits();
  const hits = results?.hits as AlgoliaHit<BrefHit>[];

  console.log(hits);

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
