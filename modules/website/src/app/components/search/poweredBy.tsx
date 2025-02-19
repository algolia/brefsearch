import Image from 'next/image';

const PoweredBy = () => {
  return (
    <div className="text-center text-md text-white flex items-center justify-center mx-auto w-[300px]">
      <span className="inline-block">Powered by</span>
      <a
        href="https://www.algolia.com/?utm_campaign=brefsearch&utm_source=brefsearch&utm_medium=referral&utm_content=powered_by"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 text-white hover:underline"
      >
        <span className="sr-only">Algolia</span>
        <Image
          src="/algolia.svg"
          alt="Algolia"
          width={80}
          height={20}
          layout="intrinsic" // 👈 Ensures it keeps its natural aspect ratio
        />
      </a>
    </div>
  );
};

export default PoweredBy;
