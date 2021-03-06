import Realm from 'realm';

import { ServerSchemaName } from './schema.js';

export default class ServerManager {
  _realm: Realm = null;
  _url: string = null;

  constructor(realm: Realm, url: string) {
    this._realm = realm;
    this._url = url;
  }

  _createDefaultObject() {
    this._realm.write(() => {
      this._realm.create(ServerSchemaName, {
        url: this._url,
        lastRoomsSynced: new Date(2000, 1, 1),
        user: null,
        password: null,
      });
    });
  }

  updateCredentials(user: string, password: string, userId: string = null, authToken: string = null) {
    const svc = this.service;
    if (svc !== null) {
      this._realm.write(() => {
        svc.user = user;
        svc.password = password;
        svc.userId = userId;
        svc.authToken = authToken;
      });
    }
  }

  get service(): any {
    let svc = this._realm.objects(ServerSchemaName);
    if (svc.length < 1) {
      this._createDefaultObject();
      svc = this._realm.objects(ServerSchemaName);
    }
    return svc.length < 1 ? null : svc[0];
  }
}
