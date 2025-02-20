import { RefObject } from 'react';
import Image from 'next/image';
import CustomSearchbox from './search/searchbox';
import PoweredBy from './search/poweredBy';
import Link from 'next/link';

const Hero = ({
  inputRef,
  setCustomQuery,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  setCustomQuery: (newQuery: string) => void;
  query: string;
}) => {
  return (
    <div className="hero grid md:grid-cols-2 sticky top-0 z-10 bg-black/90 backdrop-blur-lg p-4">
      <div className="flex-row md:flex items-center justify-center gap-4 text-center">
        <span className="sr-only">Bref.</span>
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image
            src="/Bref_logo.svg"
            alt="Bref logo"
            width={100}
            height={100}
            className="mx-auto md:mx-0"
          />
        </Link>
        <CustomSearchbox inputRef={inputRef} setCustomQuery={setCustomQuery} />
      </div>
      <div className="flex items-center justify-center md:justify-end">
        <PoweredBy />
      </div>
    </div>
  );
};

export default Hero;
