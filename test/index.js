const collect = require('../dist/index').default;
collect({
  url: 'http://your_sample_page',
  totalNum: 1000,
  dataDir: 'data',
});