import { RefObject, useState } from 'react';
import { useInstantSearch, useSearchBox } from 'react-instantsearch';

type CustomSearchboxProps = {
  inputRef: RefObject<HTMLInputElement | null>;
};

const CustomSearchbox = ({ inputRef }: CustomSearchboxProps) => {
  const { query, refine } = useSearchBox();
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);

  const isSearchStalled = status === 'stalled';

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }

  return (
    <div className="w-full py-4">
      <form
        action=""
        role="search"
        className="w-full max-w-md"
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
          placeholder="Bref, j'ai cherché dans les épisodes…"
          className="w-full rounded-md border-2 border-white/20 bg-black py-2 pl-4 pr-10 text-xl leading-5 text-white transition-colors duration-200 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          autoFocus
        />

        <span hidden={!isSearchStalled}>Searching…</span>
      </form>
    </div>
  );
};

export default CustomSearchbox;
