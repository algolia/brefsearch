import { X } from 'lucide-react';
import { useEffect } from 'react';

import { BrefHit } from '../types';
import { youtubeGivenTimeUrl, updateUrlWithVideo, removeVideoFromUrl } from '../utils/functions';

const Modal = ({
  selectedVideo,
  setSelectedVideo,
}: {
  selectedVideo: BrefHit;
  setSelectedVideo: (value: BrefHit | null) => void;
}) => {
  // Update URL when modal opens
  useEffect(() => {
    updateUrlWithVideo(selectedVideo.episode.videoId, selectedVideo.line.start);

    // Clean up URL when modal closes
    return () => {
      removeVideoFromUrl();
    };
  }, []);
  // }, [selectedVideo.episode.videoId, selectedVideo.line.start]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedVideo(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [setSelectedVideo]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent black background */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSelectedVideo(null)}
      />

      {/* Modal content - responsive sizing */}
      <div className="relative bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full mx-2 md:mx-4 max-h-[95vh] md:max-h-[90vh] overflow-hidden">
        {/* Header - reduced padding on mobile */}
        <div className="px-3 pt-2 pb-2 md:px-6 md:pt-4 md:pb-4 flex items-start md:items-center justify-between border-b border-white/10">
          <h2 className="text-base md:text-xl font-bold text-white pr-2">
            {selectedVideo.episode.index}. {selectedVideo.episode.name}
          </h2>
          <button
            className="text-white/50 hover:text-blue-500 transition-colors p-1 md:p-2 flex-shrink-0"
            onClick={() => setSelectedVideo(null)}
          >
            <X size={20} className="md:hidden" />
            <X size={24} className="hidden md:block" />
          </button>
        </div>

        {/* Video content - minimal padding on mobile for maximum video space */}
        <div className="p-2 md:p-6 md:pt-4">
          <div
            className="w-full aspect-video relative rounded-md md:rounded-lg overflow-hidden"
            style={{
              background: `url(${selectedVideo.thumbnail.lqip}) no-repeat center / cover`,
            }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              src={youtubeGivenTimeUrl(
                selectedVideo.line.url,
                selectedVideo.line.start,
              )}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
