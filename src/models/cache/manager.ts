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
        // console.log(k);
        this._realm.create(CacheSchemaName, {
          key: k, value: JSON.stringify(obj)
        }, Realm.UpdateMode.Modified);
      });
    });
  }

  get allObjects() {
    const objs = this._realm.objects(CacheSchemaName);
    return objs;
  }

  allWithPrefix(keyPrefix: string) {
    const objs = this._realm.objects(CacheSchemaName).filtered(`key BEGINSWITH "${keyPrefix}::"`);
    return objs;
  }

  getObject(keyPrefix: string, id: string) {
    const k = `${keyPrefix}::${id}`;
    const obj = this._realm.objectForPrimaryKey(CacheSchemaName, k);
    return obj;
  }
}
