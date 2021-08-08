import { create, ApisauceInstance } from 'apisauce';
import R from 'ramda';
import RS from 'ramdasauce';
import Realm from 'realm';

import ServerSchema from '../models/server/schema.js';
import ServerManager from '../models/server/manager.js';
import { IUser } from '../definition/IUser.js';
import { ITeam } from '../definition/ITeam.js';
import { IRoom } from '../definition/IRoom.js';
import { IMessage } from '../definition/IMessage/index.js';

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
      baseURL: `${svc.url}/api/v1/`,
    });
    this._setAuthHeaders();
    // attach a monitor that fires with each request
    this._api.addMonitor(
      R.pipe(
        RS.dotPath('headers.x-ratelimit-remaining'),
        R.concat('Calls remaining this hour: '),
        console.log
      )
    );
    // lets try to attach authToken
    // this._api.addMonitor(
  }

  _setAuthHeaders() {
    const svc = this._serverManager.service;
    if (svc.userId && svc.authToken) {
      this._api.setHeaders({
        'X-Auth-Token': svc.authToken,
        'X-User-Id': svc.userId,
      });
    }
  }

  login(user: string, password: string) {
    const svc = this._serverManager.service;
    console.log('====================================');
    console.log('login to service:', user);
    console.log(svc.url);
    console.log('====================================');
    this._api
      .post(`login`, { user, password })
      .then(RS.dotPath('data.data'))
      .then((response) => {
        this._serverManager.updateCredentials(user, password, response['userId'], response['authToken']);
        this._setAuthHeaders();
      });
  }

  getInfo() {
    this._api.get(`info`).then(RS.dotPath('data')).then(console.log);
    // this._api.get(`/info`).then(console.log);
  }

  getMe() {
    // this._api.get(`/me`).then(console.log);
    this._api.get(`me`).then((response) => {
      console.log(response.ok);
      console.log(response.problem);
      // console.log(response.status);
      // console.log(response.originalError);
      console.log(response.data);
    });
  }

  getTeams() {
    this._api.get(`teams.list`).then(RS.dotPath('data')).then(response => {
      const teamList = response['teams'];
      for (let i = 0; i < teamList.length; i++) {
        const t: ITeam = teamList[i];
        console.log(t);
      }
    });
  }

  getHistory(roomObj: IRoom) {
    const roomType = roomObj.t === 'c' ? "channels" : roomObj.t === 'd' ? "im" : "groups";
    this._api.get(`${roomType}.history`, { roomId: roomObj._id }).then(RS.dotPath('data')).then(response => {
      console.log("*********************************************** ", roomObj.fname);
      // console.log(response);
      const msgList = response['messages'];
      for (let i = 0; i < msgList.length; i++) {
        const m: IMessage = msgList[i];
        console.log(m);
      }
    });
  }

  getRooms() {
    this._api.get(`rooms.get`).then(RS.dotPath('data')).then(response => {
      const roomList = response['update'];
      for (let i = 0; i < roomList.length; i++) {
        const r: IRoom = roomList[i];
        console.log(r);
        // fetch the message history
        this.getHistory(r);
      }
    });
  }

  getUsers() {
    this._api.get(`users.list`).then(RS.dotPath('data')).then(response => {
      const userList = response['users'];
      for (let i = 0; i < userList.length; i++) {
        const u: IUser = userList[i];
        console.log(u);
      }
    });
  }

  getDiscussions() {
    this._api.get(`rooms.getDiscussions`).then(console.log);
  }

}
