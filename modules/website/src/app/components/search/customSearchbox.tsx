import { RefObject, useEffect, useState } from 'react';
import { useSearchBox } from 'react-instantsearch';

type CustomSearchboxProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  setCustomQuery: (newQuery: string) => void;
  initialQuery?: string;
};

const CustomSearchbox = ({
  inputRef,
  setCustomQuery,
  initialQuery = '',
}: CustomSearchboxProps) => {
  const { query, refine } = useSearchBox();

  const [inputValue, setInputValue] = useState(initialQuery || query);

  /**
   * Updates the query state and triggers refinement.
   *
   * Sets the input value, custom query, and calls the refine function
   * with the provided query string.
   *
   * @param {string} newQuery - The new query string to set and refine.
   */
  function setQuery(newQuery: string) {
    setInputValue(newQuery); // Update what is displayed in the input
    setCustomQuery(newQuery); // Tell React this is the current value
    refine(newQuery); // Tell Algolia to search on that value
  }

  // Set initial query when component mounts
  useEffect(() => {
    if (!initialQuery) return;
    setQuery(initialQuery);
  }, [initialQuery]);

  // Keep what is displayed in the input sync with the current search term
  // (useful mostly when using the back button)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  return (
    <div className="w-full py-4">
      <form
        action=""
        role="search"
        className="w-full relative"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          inputRef.current?.blur();
        }}
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setQuery('');

          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="j'ai cherché dans les épisodes…"
          className="w-full rounded-md border-2 border-white/20 bg-black py-2 px-4 text-lg md:text-4xl leading-5 text-white transition-colors duration-200 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 placeholder:hover:text-white font-bold"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          autoFocus
        />

        {/* <span hidden={!isSearchStalled}>Searching…</span> */}
      </form>
    </div>
  );
};

export default CustomSearchbox;
