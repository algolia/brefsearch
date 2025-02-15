/*  selectedVideo.line.url
                .replace('watch?v=', 'embed/')
                // remove the `&t=6s` part
                .split('&t=')[0] +
              `?&autoplay=1&start=${selectedVideo.line.start}&end=${selectedVideo.line.end}` */

export const youtubeGivenTimeUrl = (
  url: string,
  start: number,
  end: number,
) => {
  // newstart = start - 0.5
  // newend = end + 0.5
  const newstart = start;
  const newend = end;
  return (
    url.replace('watch?v=', 'embed/').split('&t=')[0] +
    `?&autoplay=1&start=${newstart}&end=${newend}`
  );
};
