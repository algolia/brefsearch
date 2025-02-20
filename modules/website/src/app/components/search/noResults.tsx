const NoResults = () => {
  return (
    <div className="text-center p-4 text-gray-600 dark:text-gray-400">
      <h2>Bref. J&apos;ai rien trouvé.</h2>
      <p>
        Mais peut-être que c&apos;est dans 
        <a 
          href="https://www.disneyplus.com/fr-fr/browse/entity-b329134e-b113-49d6-827e-dd4e0616457f" 
          target="_blank" 
          className="underline hover:text-white"
        >la saison 2 ?</a>
      </p>
    </div>
  );
};

export default NoResults;
