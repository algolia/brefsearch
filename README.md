# brefsearch

## How it works

The initial scaffolding of this project has been done with one-off scripts,
using a mix of JavaScript (see `./modules/lib/sandbox.js`), `yt-dlp` and
happyscribe.com.

Once the initial structure was done, and that I had `.mp4` files of all episodes
on disk (not tracked in the repo), I wrote some other scripts to progressively
convert the initial metadata into records suitable for Algolia.

### Sources of truth

- I downloaded all episodes in `.mp4` format and put them in `.mp4`. Those files
  are used to generate the thumbnails and animated gifs
- I also extracted the audio as `.mp3` and converted them to `.vtt` using
  happyscribe.com
- `./data/episodes` contains high-level metadata info for each episode
- `./data/vtts` contains the subtitles
- `./data/records` contains the final records that will be uploaded to Algolia;
  those files are auto-generated

### Scripts

- `yarn run update-episode-lines` reads the `.vtt` files and updates the files
  in `./data/episodes` with an array of lines, including text as well as start
  and end seconds.
- `yarn run update-episode-thumbnails` will then take each line from
  `./episodes`, and extract a thumbnail from the `.mp4` at the exact moment of
  the line. The final png is stored in another repository.
- `yarn run update-episode-gifs` does something similar, but created a 2s
  animated gif instead of a thumbnail
- `yarn run update-episode-records` splits the files in `./episodes` into
  individual files for each record. It also adds metadata about the thumbnail so
  we can display a blurry version of them.

- `yarn run deploy-data-algolia` will push the data into an index in Algolia
- `yarn run deploy-data-assets` uploads the png and gif files to a public url
  (referenced in the records).

## TODO

### Data
- Proofread the .vtt files (currently 52/80)
- Make an empty quer page, or a query suggestion, that displays the best punchlines
    - Capitaine, Capitaine, vous n'êtes pas le capitaine
    - Energy 3000, la boisson des vrais bonhommes
    - Ah parce que t'es parfait toi peut-être ?
    - Do you speak english?
    - Croquette, tu va nous manquer.
    - Le zèbre court de toutes ses forces; c'est là le prix de sa liberté.
    - Le charme du quartier.
    - Je m'appelle pas Hey
    - J'ai plus toute ma tête mais j'ai encore tout mon coeur.
    - Alors, c'est ma soirée ou c'est pas ma soirée ?


### Frontend
- Make it a great experience on mobile
- Add lazylading of images below the fold
- Warm the Cloudinary cache of the images, so they load faster
- Maybe force the width with Cloudinary
- Make the searchbar full  static on top
- Add a powered by logo
- Make the video play en entier
