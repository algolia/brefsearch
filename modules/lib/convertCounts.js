import { _ } from 'golgoth';
import { readJson } from 'firost';

/**
 * Convert raw counts into metrics usable for popularity sorting
 * @param {string} filepath Raw counts
 * @returns {Array} Array of lines
 */
export async function convertCounts(filepath) {
  const raw = await readJson(filepath);

  const heatmap = _.chain(raw.heatmap)
    .map((item) => {
      return {
        start: Math.floor(item.start_time),
        end: Math.ceil(item.end_time),
        value: Math.round(item.value * 100),
      };
    })
    .value();

  const data = {
    viewCount: raw.view_count,
    likeCount: raw.like_count,
    commentCount: raw.comment_count,
    heatmap,
  };

  return data;
}
