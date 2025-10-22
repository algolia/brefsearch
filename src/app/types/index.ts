export type BrefHit = {
  episode: {
    basename: string;
    duration: string;
    id: string;
    index: number;
    name: string;
    slug: string;
    viewCount: number;
  };
  subtitle: {
    content: string;
    index: number;
    mostReplayedScore: number;
    start: number;
  };
  media: {
    height: number;
    lqip: string;
    previewPath: string;
    thumbnailPath: string;
    width: number;
  };
  objectID: string;

  _snippetResult: SnippetType;
  _highlightResult: HighlightType;
};

export type SnippetType = {
  subtitle: {
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
  subtitle: {
    content: {
      value: string;
    };
  };
};
