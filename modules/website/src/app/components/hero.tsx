import React, { RefObject } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchBox } from 'react-instantsearch';
import CustomSearchbox from './search/customSearchbox';
import PoweredBy from './search/poweredBy';

const Hero = ({
  inputRef,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
}) => {
  const router = useRouter();
  const { refine } = useSearchBox();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    refine(''); // Clear the search
    router.push('/'); // Navigate to home
  };

  return (
    <div className="hero grid md:grid-cols-2 sticky top-0 z-10 bg-black p-4">
      <div className="flex-row md:flex items-center justify-center gap-4 text-center">
        <span className="sr-only">Bref.</span>
        <Link
          href="/"
          className="flex items-center justify-center gap-2"
          onClick={handleLogoClick}
        >
          <Image
            src="/Bref_logo.svg"
            alt="Logo bref."
            width={100}
            height={100}
            className="mx-auto md:mx-0"
          />
        </Link>
        <CustomSearchbox inputRef={inputRef} />
      </div>
      <div className="hidden md:flex items-center justify-center md:justify-end">
        <PoweredBy />
      </div>
    </div>
  );
};

export default Hero;
