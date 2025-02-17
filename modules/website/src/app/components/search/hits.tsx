import { useHits } from 'react-instantsearch';
import { BrefHit } from '@/app/types';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import CustomHit from './hit';

const CustomHits = ({
  setSelectedVideo,
  selectedVideo,
}: {
  setSelectedVideo: (value: BrefHit) => void;
  selectedVideo: boolean;
}) => {
  const { results } = useHits();
  const hits = results?.hits as AlgoliaHit<BrefHit>[];

  if (!hits?.length) {
    return (
      <div className="text-center p-4 text-gray-600 dark:text-gray-400">
        No results found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hits?.map((hit) => (
        <CustomHit
          key={hit.objectID}
          hit={hit}
          setSelectedVideo={setSelectedVideo}
          selectedVideo={selectedVideo}
        />
      ))}
    </div>
  );
};

export default CustomHits;
