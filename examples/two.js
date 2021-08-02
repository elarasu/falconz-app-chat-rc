import RC from '../build/module/lib/rc.js';
import RS from 'ramdasauce';

let chatsvc = new RC('http://localhost:3000');
chatsvc.login('admin1', 'test123');
chatsvc.getInfo();
chatsvc.getMe();

chatsvc.getTeams();

chatsvc.getRooms();

chatsvc.getUsers();

// chatsvc.getDiscussions();

// getStatus('http://localhost:3000', 'test', 'test123');
// console.log(new Service('localhost:3000'));
