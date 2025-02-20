import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';

import { BrefHit } from '../types';
import { youtubeGivenTimeUrl } from '../utils/functions';

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
      <span className="h-[5px] w-12 bg-white/20 block rounded-md mx-auto border-b-[1px] border-white/40" />

      <div className="md:p-8">
        <header className="py-2 w-full flex items-center justify-between  my-4">
          <h2 className="text-lg font-bold text-white">
            {selectedVideo.episode.index}. {selectedVideo.episode.name}
          </h2>
          <span className="md:p-4 text-right">
            <button
              className="text-white/50 hover:text-blue-500"
              onClick={() => setSelectedVideo(null)}
            >
              <X />
            </button>
          </span>
        </header>

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
            <Drawer.Title className="text-lg font-bold text-white hidden">
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
