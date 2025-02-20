export type BrefHit = {
  episode: {
    commentCount: number;
    durationHuman: string;
    durationInSeconds: number;
    index: number;
    isAgeRestricted: boolean;
    likeCount: number;
    name: string;
    season: number;
    slug: string;
    videoId: string;
    viewCount: number;
  };
  line: {
    content: string;
    end: number;
    heatBucket: number;
    index: number;
    start: number;
    url: string;
  };
  thumbnail: {
    animatedUrl: string;
    hash: string;
    height: number;
    lqip: string;
    url: string;
    width: number;
  };
  objectID: string;

  _snippetResult: SnippetType;
  _highlightResult: HighlightType;
};

export type SnippetType = {
  line: {
    content: {
      matchLevel: string;
      matchedWords: string[];
      value: string;
    };
  };
};

export type HighlightType = {
  episode: {
    name: {
      value: string;
    };
  };
  line: {
    content: {
      value: string;
    };
  };
};
