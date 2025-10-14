import React from 'react';
import Search from './components/search/search';

/**
 * Home page component for the Bref Search application.
 * Renders the main search interface.
 * @returns {React.ReactElement} The home page with search functionality
 */
export default function Home() {
  return (
    <main>
      <Search />
    </main>
  );
}
