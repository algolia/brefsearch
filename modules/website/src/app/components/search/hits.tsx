import { useHits } from 'react-instantsearch';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import CustomHit from './hit';
import NoResults from './noResults';
import { BrefHit } from '@/app/types';

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
    return <NoResults />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hits?.map((hit, hitIndex) => (
        <CustomHit
          key={hit.objectID}
          hit={hit}
          hitIndex={hitIndex}
          setSelectedVideo={setSelectedVideo}
          selectedVideo={selectedVideo}
        />
      ))}
    </div>
  );
};

export default CustomHits;
