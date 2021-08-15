import { create, ApisauceInstance } from 'apisauce';
import R from 'ramda';
import RS from 'ramdasauce';
import Realm from 'realm';

import CacheSchema from '../models/cache/schema.js';
import CacheManager from '../models/cache/manager.js';

export default class Odoo {
  _url: string = null;
  _db: string = null;
  _user: string = null;
  _uid: number = 2;
  _password: string = null;
  _api: ApisauceInstance = null;
  _realm: Realm = null;
  _cacheManager: CacheManager = null;

  constructor(url: string, db: string, realm: Realm = null) {
    this._url = url;
    this._db = db;
    this._createDefaultApiObject();
    // open realm here
    this._realm = realm !== null ? realm : new Realm({ schema: [CacheSchema] });
    this._cacheManager = new CacheManager(this._realm);
  }

  login(user: string, password: string) {
    this._user = user;
    this._password = password;
    this.call('common', 'login', this._db, this._user, this._password)
      .then(RS.dotPath('data'))
      .then((response) => {
        console.log(response);
        this._uid = response['result'];
      });
  }

  // employee related methods
  fetchAll(tableName: string) {
    this.execute(tableName, 'search_read', []).then((resp) => {
      const res = resp['data']['result'];
      this._cacheManager.updateObjects(res, tableName);
      // console.log(this._cacheManager.allWithPrefix(tableName));
      // remove keys image_*
      // const isImage = (_val, key) =>
      //   !key.startsWith('image_') &&
      //   !key.startsWith('message_') &&
      //   !key.startsWith('activity_');
      // const filteredKeys = Object.keys(R.pickBy(isImage, res[0]));
      // //   console.log(filteredKeys);
      // for (let i = 0; i < res.length; i++) {
      //   const o = res[i];
      //   console.log(R.pick(filteredKeys, o));
      // }
    });
    // this.execute('hr.attendance', 'search_read', []).then((resp) => {
    //   const res = resp['data']['result'];
    //   this._cacheManager.updateObjects(res, 'hr.attendance');
    //   console.log(this._cacheManager.allWithPrefix("hr.attendance"));
    //   // remove keys image_*
    //   // const isImage = (_val, key) =>
    //   //   !key.startsWith('image_') &&
    //   //   !key.startsWith('message_') &&
    //   //   !key.startsWith('activity_');
    //   // const filteredKeys = Object.keys(R.pickBy(isImage, res[0]));
    //   // //   console.log(filteredKeys);
    //   // for (let i = 0; i < res.length; i++) {
    //   //   const o = res[i];
    //   //   console.log(R.pick(filteredKeys, o));
    //   // }
    // });
  }

  allRecords(tableName: string) {
    return this._cacheManager.allWithPrefix(tableName);
  }

  getRecord(tableName: string, id: string) {
    return this._cacheManager.getObject(tableName, id);
  }

  // raw rpc methods
  execute(...args: any[]) {
    return this.call('object', 'execute', this._db, this._uid, this._password, ...args);
  }

  call(...args: any[]) {
    const service = args.shift(); // remove service
    const method = args.shift(); // remove method
    return this._jsonRpcCall("call", { "service": service, "method": method, "args": args });
  }

  _jsonRpcCall(...args: any[]) {
    const method = args.shift(); // remove method
    let jsonObj = {
      jsonrpc: "2.0",
      method: method,
      params: args[0],
      id: Math.floor(Math.random() * 484837 + 1).toString(36),
    };
    console.log(JSON.stringify(jsonObj));
    return this._api
      .post('', JSON.stringify(jsonObj));
    // .then(RS.dotPath('data'))
    // .then((response) => {
    //   console.log(JSON.stringify(response));
    // });
  }

  _createDefaultApiObject() {
    // define the api
    this._api = create({
      baseURL: `${this._url}/jsonrpc`,
    });
    this._api.addMonitor(
      R.pipe(
        RS.dotPath('headers.x-ratelimit-remaining'),
        R.concat('Calls remaining this hour: '),
        console.log
      )
    );
  }
}
