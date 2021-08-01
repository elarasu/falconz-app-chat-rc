import Service from '../build/module/lib/service.js';
import RS from 'ramdasauce';

// console.log(double(3));
// getStatus('localhost:3000', 'test', 'test123');
// console.log(new Service('localhost:3000'));
const translate = new Service('https://inputtools.google.com');
translate.setParams({
  itc: 'ta-t-i0-und',
  num: 13,
  ie: 'utf-8',
  oe: 'utf-8',
});
translate.setCache(200, true);
// text\=welcome\&itc\=ta-t-i0-und\&num\=13\&ie\=utf-8\&oe\=utf-8
// translate.get('/request', {
//   text: 'welcome',
// });
// translate.api
//   .get('/request', {
//     text: 'welcome',
//   })
//   .then(RS.dotPath('data'))
//   .then(console.log);
translate
  .get('/request', {
    text: 'hello',
  })
  .then(RS.dotPath('data'))
  .then((response) => {
    console.log(response);
    translate
      .get('/request', {
        text: 'world',
      })
      .then(RS.dotPath('data'))
      .then(console.log);
    translate
      .get('/request', {
        text: 'hello',
      })
      .then(RS.dotPath('data'))
      .then(console.log);
  });
// translate.get('/request', {
//   text: 'world',
// });
