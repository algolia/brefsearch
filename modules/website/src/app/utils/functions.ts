/**
 *
 * @param url
 * @param start
 * @returns {string}
 */
export const youtubeGivenTimeUrl = (url: string, start: number) => {
  const newstart = start;

  return (
    url.replace('watch?v=', 'embed/').split('&t=')[0] +
    `?&autoplay=1&start=${newstart}`
  );
};

/**
 *
 * @param name
 * @returns {string}
 */
export const slugifyCategory = (name: string): string => {
  return name.split(' ').map(encodeURIComponent).join('-');
};

/**
 *
 * @param slug
 * @returns {string}
 */
export const deslugifyCategory = (slug: string): string => {
  return slug.split('-').map(decodeURIComponent).join(' ');
};

/**
 * Return a subtitle ready for display
 * @param {string} rawSubtitle Input subtitle, can be very long
 * @returns {string} Subtitle ready for display
 */
export function formatSubtitle(rawSubtitle: string) {
  const subtitle = rawSubtitle
    .replace(/\n/g, ' ')
    .replace(/— /g, '\n— ')
    .replace(/ \?/g, ' ?')
    .replace(/… /g, '…')
    .replace(/ …/g, '…')
    .trim();

  // We wrap the word where the highlight is in a whitespace-nowrap, so it never gets cut
  return subtitle.replace(
    /(<mark>.*?<\/mark>)([^ ]*)/,
    '<span class="whitespace-nowrap">$1$2</span>',
  );
}

/**
 * Parses a URL hash to extract the search query.
 * Assumes the hash format is: #query
 *
 * @param {string} hash - The URL hash to parse.
 * @returns {{ query: string }} An object containing the decoded search query. Returns an empty string if the hash is invalid or empty.
 */
export function parseUrlHash(hash: string): { query: string } {
  if (!hash || !hash.startsWith('#')) {
    return { query: '' };
  }

  return { query: decodeURIComponent(hash.slice(1)) };
}
