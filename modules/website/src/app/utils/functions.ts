export const youtubeGivenTimeUrl = (url: string, start: number) => {
  // newstart = start - 0.5
  // newend = end + 0.5
  const newstart = start;

  return (
    url.replace('watch?v=', 'embed/').split('&t=')[0] +
    `?&autoplay=1&start=${newstart}`
  );
};
