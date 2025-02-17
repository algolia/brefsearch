import cx from 'classnames';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Types
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import { BrefHit } from '@/app/types';

const AnimatedPreview = ({ hit }: { hit: AlgoliaHit<BrefHit> }) => {
  /**
   * How it works:
   * On first load, an image of a transparent gif is displayed but the actual
   * gif blob is downloaded in the background using fetch() and saved as a ref.
   *
   * This blob will be used to generate unique Object URL that will be set as
   * the actual Image src. Using new Object URL forces the browser to restart
   * the animation from the start, but as the blob is saved in memory, it does
   * not need to do an HTTP request.
   *
   * Whenever the mouse is on the element (and on first load), we swap the
   * invisible gif with the animated gif, and whenever it leaves the element we
   * revert to the invisible gif (so it doesn't loop in the background for
   * nothing).
   **/
  const transparentGif =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const gifUrl = hit.thumbnail.gifUrl;
  const alt = hit.episode.name;

  // On first load, fetch the gif blob and save it as a ref
  const gifBlob = useRef<Blob | null>(null);
  const isFirstLoad = useRef(true);
  useEffect(() => {
    // Only load this once
    if (!isFirstLoad.current) return;
    isFirstLoad.current = false;

    // Fetch the blob, save it as a ref, and update the Image src
    async function fetchGifData() {
      const response = await fetch(gifUrl);
      const blob = await response.blob();
      gifBlob.current = blob;
      setGifSrc(URL.createObjectURL(blob));
    }
    fetchGifData();
  });

  // Swap the src between the transparent gif and the actual gif when mouse
  // enters/leaves.
  // Creates a new Object URL each time and revoke the unused ones.
  const [gifSrc, setGifSrc] = useState(transparentGif);
  const onMouseEnter = () => {
    if (!gifBlob.current) return;
    URL.revokeObjectURL(gifSrc);
    setGifSrc(URL.createObjectURL(gifBlob.current));
  };
  const onMouseLeave = () => {
    if (!gifBlob.current) return;
    setGifSrc(transparentGif);
  };

  return (
    <Image
      src={gifSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={cx('object-cover absolute z-10 invisible group-hover:visible')}
      priority={false}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      unoptimized
    />
  );
};

export default AnimatedPreview;
