# brefsearch

> [!WARNING]
> This codebase was specifically developed to index the ["Bref" YouTube playlist](https://www.youtube.com/watch?v=UO8tcf3U0dY&list=PLlFikkv2B2ffwYiFQJmcao3RKtw1DFMz5).
> While it can theoretically work for any YouTube playlist with some
> modifications, those adaptations haven't been implemented yet. The code's
> structure, logic, and various elements could be improved, but the primary goal
> was to create a functional system quickly. This documentation describes the
> current implementation while noting potential improvements.

## Overview

This project creates a searchable index of YouTube video content by extracting
subtitles, generating screenshots and video clips at specific timestamps, and
making everything searchable through Algolia. The end result allows users to
search for specific dialogue and instantly see the relevant video moment.

![Bref Search](./overview.png)

## File Storage Architecture

The project uses a specific file storage structure that's important to
understand:

1. **Temporary Files**: The project expects a `./tmp` directory containing all
   downloaded MP4 videos (`./tmp/mp4`) and MP3 audio files (`./tmp/mp3`). Those
   files are not committed to the repository, you will have to fetch them
   yourself. 

2. **Media Asset Repository**: All generated images and video clips are stored
   in a separate repository ([pixelastic/brefsearch-images](https://github.com/pixelastic/brefsearch-images)) to avoid
   bloating the main codebase. This repository is expected to be stored one level higher (ie. `./brefsearch` and `./brefsearch-imagesr side by side in the same directory.)

3. **Media Hosting**: The media files are synced to a personal server using
   `rsync`. Credentials for this server are personal and not shared in that repo either. The URLs in the JSON records point to this server. Cloudinary
   functions as a CDN, retrieving assets from this origin server.

This separation of code and data repositories is intentional for
maintainability, but means that you will probably need to do some plumbing to replicate the structure and establish your own
media storage solution when adapting this system.

## Important Note About The Pipeline

Each step in the process generates files on disk that serve as input for the
next step. This pipeline architecture has several important characteristics:

1. **Restart at Any Step**: You can restart the process at any step without
   having to run the entire pipeline from the beginning. Each step reads from
   the disk and outputs to the disk.

2. **Step Dependencies**: While steps are relatively independent, they are still
   linked in that the output of one step becomes the input of the next.

3. **Potential Data Loss**: Running a single step might overwrite or remove
   certain information from the record files. Therefore, it's often necessary to
   run subsequent steps to restore or re-add this information correctly.

4. **JSON as Source of Truth**: The final output consists of JSON files on disk
   that represent each Algolia record, stored in `./data/records`. These files
   are the source of truth and are directly pushed to Algolia.

This design allows for flexibility when making changes or corrections at
specific stages without reprocessing everything, but requires understanding the
dependencies between steps to maintain data integrity.

## Final Record Structure

Understanding the final record structure helps visualize what we're trying to
create:

```json
{
  "episode": {
    "commentCount": 861,
    "durationHuman": "2:52",
    "durationInSeconds": 172,
    "index": 75,
    "isAgeRestricted": false,
    "likeCount": 89384,
    "name": "Bref. J'ai tout cassé.",
    "season": 1,
    "slug": "brefJaiToutCasse",
    "videoId": "9u9X-FzVWZ0",
    "viewCount": 7053468
  },
  "line": {
    "content": "Et puis, j'ai eu un point de côté.",
    "end": 81,
    "heatBucket": 1,
    "index": 30,
    "start": 77,
    "url": "https://www.youtube.com/watch?v=9u9X-FzVWZ0&t=77s"
  },
  "thumbnail": {
    "animatedUrl": "https://assets.pixelastic.com/brefsearch/animated/S01E75_brefJaiToutCasse/077.mp4",
    "hash": "d3628d89c6",
    "height": 1080,
    "lqip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAIAAAC0SDtlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRDb21tZW50AG9yb3NoaV9jb21wcmVzc2VkJoea2wAAAbdJREFUeJwFwW1TmgAAAGC+by5p2VLXOc4imIgoiLyIokA4h4jKiUvHwjNzOk+zW+ZbtvRW81rdvu/7/uaeBzgpFgadtnNSK6nyJ/2jY5m1Qt7MKYaU7p7aty3rey72NUvUecxUREMWAf1YNrV8taiX8rn+efuy3xv2ev1u12nU66lYnUFuDHai0W0RP7MbzWYLKKuSkVNMo5CXRNuqtG2rVlQvRpfr5cKO+Ll3u1+S2FU+PlCI9d3t6vEZUClMZaISR5FIkMMRPobRYXh8PX74tdGpUCLwhgj4MmjApOBvZ87y7geQCCFpisgwMTYa1sSkzNNcFBsN+pvfT5PZ/P2+D97zRAI+1Os5hA5m02sggaFpimCIkEDiusTXCkpOoDtOY/Nwv1zMDvxeaHdn3+N5u+0WyOhsMgaKWV5mSAZHxThRPk4+rafPP6etqraaT1eL+REE7YEguPU6FfReVD+MhkPALmkqT7NhhCcwTUz8ub/59/dx0rGueudlkYV8/h339isXGIe8FYFsfm4AapIlUBg/CmKHUDYR0TJcSebLWcaxKqfVipJObb1wuV66vSAowH5DSv0HVkF6hOQyHA8AAAAASUVORK5CYII=",
    "url": "https://assets.pixelastic.com/brefsearch/thumbnails/S01E75_brefJaiToutCasse/077.png",
    "width": 1920
  }
}
```

Each record represents a specific moment in a video where a line or paragraph is
spoken, along with metadata about the video and media assets for the search
result display.

## Prerequisites

- Node.js (v18+)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)
- An [Algolia](https://www.algolia.com/) account
- Speech-to-text service (like [HappyScribe](https://www.happyscribe.com/) or [Whisper](https://github.com/openai/whisper))
- Server for hosting media files
- A [Vercel](https://vercel.com/) account for deployment

## Detailed Process Steps

### 1. Download YouTube videos

I used `yt-dlp` to download all videos of the playlist in `./tmp/mp4`. I think it
was something like `yt-dlp "{playlistId}"`.

> [!TIP]
> You'll want to have good video quality, as we'll use those files to extract
> the screenshots and previews. Sound quality doesn't matter here.

> [!TIP]
> Some videos are age restricted, so you might need to pass
> `--cookiers-from-browser firefox` to use your Firefox cookies to bypass it and
> download them.

> [!CAUTION]
> There is no script to do that job for you (sorry!). I ran all those commands
> manually when I built the project, so you'll have to do some trial and error
> to replicate it. At the end of the day, the other scripts expect files to be
> named something like `S01E75_brefJaiToutCasse.mp3`.

### 2. Download YouTube audio

I used `yt-dlp` to download only the audio from the videos. I used
`--extract-audio` to only download the audio.

> [!TIP]
> You'll probably only need a mono 16khz file for the audio, as this is what Whisper accept as input.

> [!CAUTION]
> Still no script to do that for you. Sorry again.

### 3. Generate Subtitles

Here, I needed to transform the `.mp3` files I have into `.vtt` (subtitle)
files. I used
[https://www.happyscribe.com/](https://www.happyscribe.com/) manually to do
that: I uploaded each `.mp3` file to their UI and downloaded the resulting
`.vtt` file.

I then proofread them all (re-watching the whole TV Show locally with subtitles
added). I would say HappyScribe did a 90% good job, but I still had to fix some
proper nouns and when multiple people were speaking at the same time.

`.vtt` files are stored and committed in `./data/vtts`, following the same
pattern as the video/audio files. If you need to do proofreading, this is where you'll need to edit the content.

> [!NOTE]
> You can probably automate that with a call to OpenAI Whisper API or HappyScribe if you're looking to build an automated pipeline.

> [!TIP]
> YouTube generate sautomatic captions for its videos, that you can get with `yt-dlp --write-subs` but the quality on french content was horrible, so I couldn't use
> them. Maybe if your content is well spoken in clear english it could work for
> you.

### 5. Scaffold the `./data/episodes` folder

Here, I also did some manual work. I called `yt-dlp --dump-json` on each video
of the playlist and extracted the name and duration from each video and created
an entry in `./data/episodes` for each video.

Each entry looked someting like this:

```json
{
  "duration": {
    "human": "1:48",
    "inSeconds": 108
  },
  "episode": {
    "index": 2,
    "name": "Bref. Je remets tout à demain.",
    "season": 1,
    "slug": "brefJeRemetsToutADemain"
  },
  "episodes": []
}
```

### 6. Cleanup subtitles

Here, we are starting to get into script territory. If you run `yarn run
update-episode-lines`, it will read all `.vtt` files and update the `.lines`
array of the episode files we created earlier.

Each element of the array will contain the `.content` (what is being said) and
the `.start` (when it is being said).

> [!NOTE]
> There is also some data sanitization in place in that step. Basically, you
> don't want lines to be cut in the middle of a sentence, so the script merges
> several subtitles together until they form a complete sentence, while keeping an
> optimal width.

> [!NOTE]
> I also saved the `.end` value in there, but I don't really use it anywhere.

### 7. Update popularity metrics

Running the `yarn run update-episode-count` will fetch all metadata for all
video and store it as a huge JSON file in `./data/counts`.

Those JSON files contains a lot of information, but only a few keys are
important.

- `.view_count`, `.comment_count` and `.like_count` can give popularity metrics
  about which videos are the most popular. I only used `.view_count` in my
  implementation.
- `.heatmap` contains an array representation of exactly 100 segments of equal
  length of the video, attributing a score (`.value`) between 0 and 1 to each.
  A high value means that segment has been watched a lot, a low value means it
  hasn't be watched often.

I will be using both metrics later in the ranking formula of Algolia.

> [!NOTE]
> Raw values of the heatmap have too much granularity and are not very useful in
> an Algolia ranking formula, so I grouped the segments in 5 "buckets" of equal
> lengths, basically turning this value into a 5-star rating system of each
> segment. This make the ranking way more useful.
>
> Now that I think of it, I should have done the same thing with the
> `.view_count` ¯\\_(ツ)_/¯


### 8. Generate thumbnails

Thumbnails are the static `.png` images displayed along a search result. You can
generate them by running the `yarn run update-episode-thumbnails` function.

This will use `ffmpeg` to extract a screenshot at the exact timestamp defined in
the `./data/episodes` JSON files, for each line. Files will be stored in another
repository (expected to be one level higher in the hierarchy, and named
`brefsearch-images`).

> [!WARNING]
> Be aware that it will generate many heavy images. I personally ran an optional
> compression script on them before committing them to the repo.
> I chose to extract high quality version of the images, even if Cloudinary will
> resize and compress them later, to have a baseline with the highest possible
> quality, in case I want to make Cloudinary less aggressive in its compression later.


### 9. Generate previews

Previews are the animated 2s looping videos that start playing when you hover
a result. You can generate them with `yarn run update-episode-animated`.

This is very similar to the thumbnail generation, except that it will generate
videos. The output file will already be compressed this time, so it shouldn't
take up to much space, but it might require more processing power to run.

> [!TIP]
> In an earlier version, I had tried to generate `.gif` file but the quality was
> horrible and the file size was even worse. Stick to `.mp4` video, they work
> well.

### 10. Build the final records

Running `yarn run update-episode-records` will stitch all our previous steps
together and output JSON files in `./data/records`. One file will be generated
per record, which gives you a good view of what will end up in your Algolia
index.

Each record is made of three main keys:

`.episode` contains metadata shared across all subtitles of a given video. Of
interest here are the `.durationHuman`, `.index`, `.name`, `.slug`, `.videoId`
and `.viewCount` keys that I re-use in the display somehow. 

> [!TIP]
> Other keys like `.durationInSeconds`, `.isAgeRestricted` or `.likeCount` are
> not really used. I should remove them.

`.line` contains info about the subtitle at that exact moment. `.content` is
what is being said. `.start` is when it is being said. `.heatBucket` is the
"rating" of that specific line in the whole video.

> [!TIP]
> `.end` is never used. `.index` indicates that this is the nth subtitle of that
> video. `.url` is redundant because we can craft it
> from other keys in the record. One can potentially infer the URL from the other parts of the records rather than storing them.

`.thumbnail` contain info about the static thumbnail and animated preview. Of
importance are the `.url` (for the thumbnail) and `.animatedUrl` (for the
animated preview). They point to one of my own servers, that is used as the
origin server for Cloudinary.

> [!TIP]
> `.lqip` also contains a very important info: a base64 encoded string of
> a blurry version of the final image. This can be used to display a Low Quality
> Image Placeholder of the search result as soon as the record is returned by
> Algolia, without waiting for the full image to load. `.hash`, `.width` and
> `.height` are here to help you with cache busting or CSS.

### 11. Deploying assets

This part will deploy all the static thumbnails and animated preview to
a private server of mine, using `rsync`. You will have to replace that step with
another way to deploy the static assets and modifiy the `thumbnail.url` and
`thumbnail.animatedPreview` accordingly in the records.

You can try running `yarn run deploy-data-assets` but it will not work
for you.

### 12. Configure & Push to Algolia

Run `yarn run deploy-data-algolia` to push data to your Algolia index and
configure it accordingly. The most notable configuration is the use of
`distinct` and `attributeForDistinct` set to `episode.videoId`. This instructs
Algolia to only return one match per episode.

We are technically using two indices here. The main one is used when we first
display the website, and will order results by `episode.index` and `line.index`
(basically rendering episodes in the order in which they were released, with the
first sentence displayed.). 

But a trick on the front-end will swap to a secondary replica (called
`popularity`) that ranks episodes based on the number of view per episodes, and
the most popular sentence (matching the query) inside of an episode, the moment you start typing something in the search bar.

The indexing uses an **[atomic](https://github.com/pixelastic/algolia-indexing)** strategy, meaning that each update will only
add/delete/update the records that actually changed, rather than deleting
everything and re-adding them.

> [!WARNING]
> You need to have your own `appId`, `indexName` and `adminApiKey` configured in
> `./modules/lib/config.js` for this to work.

### 13. Build the front-end

Go into `./modules/website` and run `yarn run dev` to load the website locally,
or `yarn run build` to build it.


### Thanks

- [@lukyvj](https://bsky.app/profile/lukyvj.bsky.social) for the front-end
- [@sarahdayan](https://bsky.app/profile/sarahdayan.com) for the subtitle best practices
- [@fluf22](https://github.com/fluf22) for the video compression tips
