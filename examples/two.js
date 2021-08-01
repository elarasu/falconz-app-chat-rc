import RC from '../build/module/lib/rc.js';
import RS from 'ramdasauce';

let chatsvc = new RC('http://localhost:3000');
// chatservice.login('test', 'test123');
chatsvc.getInfo();

// getStatus('http://localhost:3000', 'test', 'test123');
// console.log(new Service('localhost:3000'));
