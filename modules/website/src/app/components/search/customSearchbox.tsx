import { RefObject, useEffect, useState } from 'react';
import { useSearchBox } from 'react-instantsearch';
import { parseUrlHash } from '@/app/utils/functions';

type CustomSearchboxProps = {
  inputRef: RefObject<HTMLInputElement | null>;
};

const CustomSearchbox = ({ inputRef }: CustomSearchboxProps) => {
  const { query, refine } = useSearchBox();

  const [inputValue, setInputValue] = useState('');

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
    refine(newQuery); // Tell Algolia to search on that value
  }

  // Initialize query from URL hash on mount
  useEffect(() => {
    const urlState = parseUrlHash(window.location.hash);
    if (urlState.query) {
      setQuery(urlState.query);
    }
  }, []);

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
