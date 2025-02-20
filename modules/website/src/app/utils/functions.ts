export const youtubeGivenTimeUrl = (url: string, start: number) => {
  const newstart = start;

  return (
    url.replace('watch?v=', 'embed/').split('&t=')[0] +
    `?&autoplay=1&start=${newstart}`
  );
};

export const slugifyCategory = (name: string): string => {
  return name.split(' ').map(encodeURIComponent).join('-');
};

export const deslugifyCategory = (slug: string): string => {
  return slug.split('-').map(decodeURIComponent).join(' ');
};
