import Odoo from '../build/module/lib/odoo.js';
// import R from 'ramda';
// import RS from 'ramdasauce';

const DB = 'bitnami_odoo';
const USER = 'demo';
const PASS = 'test123';
let erp = new Odoo('http://localhost', DB);
erp.login(USER, PASS);
//erp.execute('hr.attendance', 'search_read', []).then((resp) => {
erp.fetchAll('hr.employee');
const objs = erp.allRecords('hr.employee');
objs.forEach((element) => {
  console.log(element.key);
});
const obj = erp.getRecord('hr.employee', '12');
console.log(obj.key, obj.value, obj.dirty);
