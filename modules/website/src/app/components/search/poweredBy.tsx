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
          src="/Algolia.svg"
          alt="Algolia"
          width={120}
          height={20}
          layout="intrinsic" // 👈 Ensures it keeps its natural aspect ratio
        />
        <span className="font-black block text-2xl italic">3000</span>
      </a>
    </div>
  );
};

export default PoweredBy;
