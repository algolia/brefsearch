/**
 * Converts a YouTube watch URL to an embed URL with a specific start time and autoplay.
 * @param {string} url - The original YouTube watch URL
 * @param {number} start - The start time in seconds
 * @returns {string} The modified embed URL with autoplay and start time parameters
 */
export const youtubeGivenTimeUrl = (url: string, start: number) => {
  const newstart = start;

  return (
    url.replace('watch?v=', 'embed/').split('&t=')[0] +
    `?&autoplay=1&start=${newstart}`
  );
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
