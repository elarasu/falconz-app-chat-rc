import { double, getStatus } from '../build/module/lib/number.js';
import { Service } from '../build/module/lib/service.js';

console.log(double(3));
getStatus('localhost:3000', 'test', 'test123');
console.log(new Service('localhost:3000'));
