// import { double, getStatus } from '../build/module/lib/number.js';
import { Service } from '../build/module/lib/service.js';

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
// text\=welcome\&itc\=ta-t-i0-und\&num\=13\&ie\=utf-8\&oe\=utf-8
translate.get('/request', {
  text: 'welcome',
});
translate.get('/request', {
  text: 'hello',
});
translate.get('/request', {
  text: 'world',
});
