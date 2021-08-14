import Realm from 'realm';

import { CacheSchemaName } from './schema.js';

export default class CacheManager {
  _realm: Realm = null;

  constructor(realm: Realm) {
    this._realm = realm;
  }

  updateObjects(objs: any[], keyPrefix: string) {
    if (objs == null || objs.length < 1) return;
    console.log(objs.length);
    this._realm.write(() => {
      objs.forEach(obj => {
        const k = `${keyPrefix}::${obj.id}`;
        console.log(k);
        this._realm.create(CacheSchemaName, {
          key: k, value: JSON.stringify(obj)
        }, Realm.UpdateMode.Modified);
      });
    });
  }

  get allObjects() {
    const svc = this._realm.objects(CacheSchemaName);
    console.log(svc.length);
    // if (svc.length < 1) {
    //   this._createDefaultObject();
    //   svc = this._realm.objects(CacheSchemaName);
    // }
    // return svc.length < 1 ? null : svc[0];
    return svc;
  }

  allWithPrefix(keyPrefix: string) {
    const svc = this._realm.objects(CacheSchemaName).filtered(`key BEGINSWITH "${keyPrefix}::"`);
    console.log(svc.length);
    // if (svc.length < 1) {
    //   this._createDefaultObject();
    //   svc = this._realm.objects(CacheSchemaName);
    // }
    // return svc.length < 1 ? null : svc[0];
    return svc;
  }
}
