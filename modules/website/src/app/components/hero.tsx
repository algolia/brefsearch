import { RefObject } from 'react';
import Image from 'next/image';
import CustomSearchbox from './search/searchbox';
import PoweredBy from './search/poweredBy';

const Hero = ({
  inputRef,
  setCustomQuery,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  setCustomQuery: (newQuery: string) => void;
  query: string;
}) => {
  return (
    <div className="hero grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="col-start-4 col-span-6 border border-red-300 flex items-center justify-center gap-4">
        <Image src="/Bref_logo.svg" alt="Bref logo" width={100} height={100} />
        <CustomSearchbox inputRef={inputRef} setCustomQuery={setCustomQuery} />
        <PoweredBy />
      </div>
    </div>
  );
};

export default Hero;
