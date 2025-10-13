import { parseUrlHash } from '@/app/utils/functions';

export const brefRouter = {
  read() {
    const { query } = parseUrlHash(window.location.hash);
    if (!query) return {};
    return {
      brefsearch: {
        query,
      },
    };
  },

  write(routeState: any) {
    const query = routeState.brefsearch?.query || '';
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
};
