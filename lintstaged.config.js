import config from 'aberlaas/configs/lintstaged';

export default {
  ...config,
  '*.{jsx,ts,tsx}': ['yarn run lint:fix --js'],
  '*.png': [],
};
