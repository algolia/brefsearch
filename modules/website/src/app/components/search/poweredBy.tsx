const PoweredBy = () => {
  return (
    <div className="text-center text-md text-white">
      <span>Powered by</span>
      <a
        href="https://www.algolia.com/?utm_campaign=brefsearch&utm_source=brefsearch&utm_medium=referral&utm_content=powered_by"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 text-white hover:underline"
      >
        <span className="sr-only">Algolia</span>
      </a>
    </div>
  );
};

export default PoweredBy;
