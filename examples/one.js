// import { double, getStatus } from '../build/module/lib/number.js';
import { Service } from '../build/module/lib/service.js';
import LRU from 'lru-cache';
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
translate.setCache(200);
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

var cache = new LRU({
  max: 3,
  lengthit: function (n, key) {
    console.log('***** length ****', n, key);
    return n * 2 + key.length;
  },
  dispose: function (key, n) {
    console.log('======= dispose ==== ');
    console.log(key);
    console.log(n);
    // n.close();
  },
  maxAgeit: 1000 * 60 * 60,
});
cache.set('key', 'value');
console.log(cache.get('key'));
cache.set('key1', 'value1');
console.log(cache.get('key1'));
console.log(cache.dump());
cache.set('key2', 'value2');
console.log(cache.get('key2'));
cache.set('key3', 'value3');
console.log(cache.get('key3'));
console.log(cache.dump());
cache.set('key4', 'value4');
console.log(cache.get('key4'));
cache.set('key5', 'value5');
console.log(cache.get('key5'));
console.log(cache.dump());
