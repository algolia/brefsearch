import Image from 'next/image';

const PoweredBy = () => {
  return (
    <div className="text-center text-md text-white flex items-center justify-center w-auto gap-1">
      <a
        href="https://www.algolia.com/?utm_campaign=brefsearch&utm_source=brefsearch&utm_medium=referral&utm_content=powered_by"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 text-white hover:underline flex items-center gap-2"
      >
        <span className="sr-only">Algolia</span>
        <Image
          src="/Algolia_3000_4.webp"
          alt="Algolia"
          width={180}
          height={30}
          layout="intrinsic" // 👈 Ensures it keeps its natural aspect ratio
        />
      </a>
    </div>
  );
};

export default PoweredBy;
