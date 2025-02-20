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
  return rawSubtitle
    .replace(/\n/g, ' ')
    .replace(/— /g, '\n— ')
    .replace(/ \?/g, ' ?')
    .replace(/… /g, '…')
    .replace(/ …/g, '…')
    .trim();
}

