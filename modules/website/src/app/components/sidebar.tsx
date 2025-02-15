import { BrefHit } from '../types';
import { youtubeGivenTimeUrl } from '../utils/functions';
import YoutubePlayer from './youtubePlayer';

const Sidebar = ({
  selectedVideo,
  setSelectedVideo,
}: {
  selectedVideo: BrefHit;
  setSelectedVideo: (value: BrefHit | null) => void;
}) => {
  return (
    <div className="bg-slate-900 sticky top-0 h-screen rounded-lg">
      <header>
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-bold text-white">Détails de l'épisode</h2>
          <button
            className="text-white hover:text-blue-500"
            onClick={() => setSelectedVideo(null)}
          >
            Fermer
          </button>
        </div>
      </header>
      <div className="p-8">
        <h2 className="text-lg font-bold text-white">
          {selectedVideo.episode.name}
        </h2>
        <div
          className="w-full h-[400px] relative p-2"
          style={{
            background: `url(${selectedVideo.thumbnail.lqip})no-repeat center / cover`,
          }}
        >
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              src={youtubeGivenTimeUrl(
                selectedVideo.line.url,
                selectedVideo.line.start,
                selectedVideo.line.end,
              )}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-8">
          <h3>Voir l'épisode en entier</h3>
          <div
            className="w-full h-[400px] relative p-2"
            style={{
              background: `url(${selectedVideo.thumbnail.lqip})no-repeat center / cover`,
            }}
          >
            <YoutubePlayer videoId={selectedVideo.episode.videoId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
