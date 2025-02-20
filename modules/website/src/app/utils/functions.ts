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
  return rawSubtitle
    .replace(/\n/g, ' ')
    .replace(/— /g, '\n— ')
    .replace(/ \?/g, ' ?')
    .replace(/… /g, '…')
    .replace(/ …/g, '…')
    .trim();
}
