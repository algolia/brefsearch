import { _ } from 'golgoth';
import { read } from 'firost';
/**
 * Convert a 00:02:12.456 time to 132 seconds
 * @param {string} vttTime Time in vtt format
 * @returns {number} Number of seconds
 */
function vttTimeToSeconds(vttTime) {
  return _.chain(vttTime)
    .split('.')
    .first()
    .split(':')
    .thru(([hours, minutes, seconds]) => {
      return (
        _.parseInt(hours) * 60 * 60 +
        _.parseInt(minutes) * 60 +
        _.parseInt(seconds)
      );
    })
    .value();
}

/**
 * Convert a VTT file into an array of "lines"
 * @param {string} filepath VTT filepath
 * @returns {Array} Array of lines
 */
export async function convertVtt(filepath) {
  const rawContent = await read(filepath);

  const firstPass = _.chain(rawContent)
    .split('\n\n')
    .slice(1)
    .map((paragraph) => {
      const firstLine = _.chain(paragraph).split('\n').first().value();
      const content = _.chain(paragraph)
        .split('\n')
        .slice(1)
        .join('\n')
        .value();

      const start = _.chain(firstLine)
        .split(' --> ')
        .first()
        .thru(vttTimeToSeconds)
        .value();
      const end = _.chain(firstLine)
        .split(' --> ')
        .last()
        .thru(vttTimeToSeconds)
        .value();

      return {
        start,
        end,
        content,
      };
    })
    .value();

  // Now we'll group lines together if they don't end with a dot.
  const secondPass = [];
  let skipNext = false;
  _.each(firstPass, (line, index) => {
    if (skipNext) {
      skipNext = false;
      return;
    }

    if (
      _.endsWith(line.content, '.') ||
      _.endsWith(line.content, ':') ||
      _.endsWith(line.content, '?') ||
      _.endsWith(line.content, '!')
    ) {
      secondPass.push(line);
      return;
    }

    const next = firstPass[index + 1];
    if (!next) {
      return;
    }
    skipNext = true;

    const start = line.start;
    const end = next.end;
    const content = `${line.content}\n${next.content}`;
    secondPass.push({
      start,
      end,
      content,
    });
  });

  return secondPass;
}
