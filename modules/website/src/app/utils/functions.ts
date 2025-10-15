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
 * Parses a URL hash to extract the search query, videoId, and timestamp.
 * Assumes the hash format is: #query or #query▮videoId:timestamp
 * Content after ▮ is ignored for query parsing.
 *
 * @param {string} hash - The URL hash to parse.
 * @returns {{ query: string, videoId?: string, timestamp?: string }} An object containing the decoded search query, videoId, and timestamp.
 */
export function parseUrlHash(hash: string): {
  query: string;
  videoId?: string;
  timestamp?: string;
} {
  if (!hash || !hash.startsWith('#')) {
    return { query: '' };
  }

  // Remove the # and decode first, then split by ▮
  const hashContent = decodeURIComponent(hash.slice(1));
  const queryPart = hashContent.split('▮')[0];
  const videoPart = hashContent.split('▮')[1];
  const [videoId, timestamp] = videoPart ? videoPart.split(':') : [null, null];

  return { query: queryPart, videoId, timestamp };
}

/**
 * Updates the URL hash to include video information while preserving the current query.
 * Format: #query▮videoId:timestamp or #▮videoId:timestamp if no query
 *
 * @param {string} videoId - The video ID to add to the URL
 * @param {number} timestamp - The video timestamp to add to the URL
 */
export function updateUrlWithVideo(videoId: string, timestamp: number): void {
  const currentHash = window.location.hash;
  const { query } = parseUrlHash(currentHash);

  const encodedQuery = encodeURIComponent(query);
  const newHash = `#${encodedQuery}▮${videoId}:${timestamp}`;
  window.history.replaceState(null, '', newHash);
}

/**
 * Removes video information from the URL hash, keeping only the query.
 */
export function removeVideoFromUrl(): void {
  const currentHash = window.location.hash;
  const { query } = parseUrlHash(currentHash);

  const encodedQuery = encodeURIComponent(query);
  const newHash = `#${encodedQuery}`;
  window.history.replaceState(null, '', newHash);
}
