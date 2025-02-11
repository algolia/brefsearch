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
 *
 * @param filepath
 */
export async function convertVtt(filepath) {
  const rawContent = await read(filepath);

  const lines = _.chain(rawContent)
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
    });

  console.info(lines);
}
