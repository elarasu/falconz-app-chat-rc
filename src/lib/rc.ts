import { create, ApisauceInstance } from 'apisauce';
import R from 'ramda';
import RS from 'ramdasauce';
import Realm from 'realm';

import ServerSchema from '../models/server/schema.js';
import ServerManager from '../models/server/manager.js';

export default class RC {
  _realm: Realm = null;
  _url: string = null;
  _user: string = null;
  _password: string = null;
  _serverManager: ServerManager = null;
  _api: ApisauceInstance = null;

  constructor(url: string) {
    this._url = url;
    // open realm here
    this._realm = new Realm({ schema: [ServerSchema] });
    this._serverManager = new ServerManager(this._realm, url);
    this._createDefaultApiObject();
  }

  _createDefaultApiObject() {
    const svc = this._serverManager.service;
    // define the api
    this._api = create({
      baseURL: `${svc.url}/api/v1`,
    });
    // attach a monitor that fires with each request
    this._api.addMonitor(
      R.pipe(
        RS.dotPath('headers.x-ratelimit-remaining'),
        // R.concat('Calls remaining this hour: '),
        console.log
      )
    );
  }

  login(user: string, password: string) {
    const svc = this._serverManager.service;
    console.log('====================================');
    console.log(user, password);
    console.log(svc.lastRoomsSynced, svc.url);
    console.log('====================================');
  }

  getInfo() {
    this._api.get(`/info`).then(RS.dotPath('data')).then(console.log);
  }

  getStatus() {
    const svc = this._serverManager.service;
    console.log('====================================');
    console.log(svc.lastRoomsSynced, svc.url);
    console.log('====================================');
    // define the api

    // api.get(`/me`).then((response) => {
    //   console.log(response.ok);
    //   console.log(response.problem);
    //   console.log(response.status);
    //   console.log(response.originalError);
    //   console.log(response.data);
    // });
    // // if login token is present, set those in api credentials
    // if (!svc['userId'] || !svc['authToken']) {
    //   api
    //     .post(`/login`, { user: svc['user'], password: svc['password'] })
    //     .then(RS.dotPath('data.data'))
    //     .then((response) => {
    //       api.setHeaders({
    //         'X-Auth-Token': response['authToken'],
    //         'X-User-Id': response['userId'],
    //       });
    //     });
    // } else {
    //   api.setHeaders({
    //     'X-Auth-Token': svc['authToken'],
    //     'X-User-Id': svc['userId'],
    //   });
    // }
  }

  // api
  //   .post(`/login`, { user: 'xxxx', password: 'xxxx' })
  //   .then(RS.dotPath('data.data'))
  //   .then((response) => {
  //     api.setHeaders({
  //       'X-Auth-Token': response['authToken'],
  //       'X-User-Id': response['userId'],
  //     });
  //     // console.log(response);
  //     api
  //       .get(`/rooms.get`)
  //       .then(RS.dotPath('data'))
  //       // .then(R.concat('Latest Commit: '))
  //       .then(console.log);
  //   });
}
