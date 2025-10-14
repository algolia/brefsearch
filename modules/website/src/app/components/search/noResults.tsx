const NoResults = () => {
  return (
    <div className="h-auto flex items-center justify-center text-center text-xl md:text-3xl p-4 text-gray-400 dark:text-gray-400 leading-10 mt-12">
      <div>
        <h2 className="font-bold">Bref. J&apos;ai rien trouvé&hellip;</h2>
        <p>
          Mais peut-être que c&apos;est dans&nbsp;
          <a
            href="https://www.disneyplus.com/fr-fr/browse/entity-b329134e-b113-49d6-827e-dd4e0616457f"
            target="_blank"
            className="underline hover:text-white"
          >
            la saison 2 ?
          </a>
        </p>
      </div>
    </div>
  );
};

export default NoResults;
