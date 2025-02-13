import path from 'node:path';
import {
  absolute,
  exists,
  glob,
  move,
  read,
  readJson,
  write,
  writeJson,
} from 'firost';
import { _, pMap } from 'golgoth';
import { convertVtt } from './convertVtt.js';

const list = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes/'),
});

const concurrency = 1;
await pMap(
  list,
  async (filepath) => {
    const item = await readJson(filepath);
    const basename = path.basename(filepath, '.json');

    await pMap(
      item.lines,
      async (line, lineIndex) => {
        const paddedIndex = _.padStart(lineIndex, 2, '0');
        const start = _.padStart(line.start, 3, '0');
        const thumbnailFilepath = absolute(
          `<gitRoot>/../brefsearch-images/pictures/${basename}/${paddedIndex}.png`,
        );
        if (!(await exists(thumbnailFilepath))) {
          console.info({ thumbnailFilepath });
          return;
        }
        const newFilepath = absolute(
          `<gitRoot>/../brefsearch-images/pictures/${basename}/${start}.png`,
        );
        await move(thumbnailFilepath, newFilepath);
      },
      { concurrency },
    );
  },
  { concurrency },
);
