export type BrefHit = {
  episode: {
    durationHuman: string;
    durationInSeconds: number;
    index: number;
    name: string;
    slug: string;
    videoId: string;
    viewcount: number;
  };
  line: {
    content: string;
    end: number;
    index: number;
    start: number;
    url: string;
  };
  thumbnail: {
    gifUrl: string;
    hash: string;
    height: number;
    lqip: string;
    url: string;
    width: number;
  };
  objectID: string;
};
