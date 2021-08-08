import Odoo from '../build/module/lib/odoo.js';

const DB = 'bitnami_odoo';
const USER = 'demo';
const PASS = 'test123';
let erp = new Odoo('localhost', DB);
erp.login(USER, PASS);
erp.execute('hr.attendance', 'search_read', []).then((resp) => {
  console.log(resp['data']['result']);
});
