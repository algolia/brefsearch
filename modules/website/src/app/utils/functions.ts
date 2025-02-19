export const youtubeGivenTimeUrl = (url: string, start: number) => {
  const newstart = start;

  return (
    url.replace('watch?v=', 'embed/').split('&t=')[0] +
    `?&autoplay=1&start=${newstart}`
  );
};
