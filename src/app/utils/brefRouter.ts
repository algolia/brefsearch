import { parseUrlHash } from '@/app/utils/functions';
import { config } from '@/app/utils/config';

export const brefRouter = {
  read() {
    const { query } = parseUrlHash(window.location.hash);
    if (!query) return {};
    return {
      [config.indexName]: {
        query,
      },
    };
  },

  write(routeState: any) {
    const query = routeState[config.indexName]?.query || '';
    const hash = query ? `#${encodeURIComponent(query)}` : '';

    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  },

  onUpdate(cb: any) {
    const handleHashChange = () => {
      cb(this.read());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  },

  dispose() {
    // Required method for InstantSearch router interface
  },

  createURL(routeState: any) {
    const query = routeState[config.indexName]?.query || '';
    const hash = query ? `#${encodeURIComponent(query)}` : '';
    return `${window.location.origin}${window.location.pathname}${hash}`;
  },
};
