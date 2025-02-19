import { useEffect, useState } from 'react';
import { BrefHit } from '../types';
import { youtubeGivenTimeUrl } from '../utils/functions';
import { Drawer } from 'vaul';

const Sidebar = ({
  selectedVideo,
  setSelectedVideo,
}: {
  selectedVideo: BrefHit;
  setSelectedVideo: (value: BrefHit | null) => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if screen width is below 768px
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const content = (
    <>
      <header>
        <div className="flex justify-between items-center p-4">
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
            background: `url(${selectedVideo.thumbnail.lqip}) no-repeat center / cover`,
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
              )}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );

  return isMobile ? (
    <Drawer.Root
      open={!!selectedVideo}
      onOpenChange={() => setSelectedVideo(null)}
    >
      <div className="z-10">
        <Drawer.Overlay className="fixed inset-0 bg-black/50" />
        <Drawer.Portal>
          <Drawer.Content className="fixed bottom-0 left-0 right-0 h-[80vh] bg-slate-900 rounded-t-lg shadow-lg p-4 z-10">
            <Drawer.Title className="text-lg font-bold text-white">
              Détails de l&apos;épisode
            </Drawer.Title>
            {content}
          </Drawer.Content>
        </Drawer.Portal>
      </div>
    </Drawer.Root>
  ) : (
    <div className="bg-slate-900 sticky top-0 h-screen rounded-lg">
      {content}
    </div>
  );
};

export default Sidebar;
