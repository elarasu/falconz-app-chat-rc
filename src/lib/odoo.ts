import { create, ApisauceInstance } from 'apisauce';
import RS from 'ramdasauce';

export default class Odoo {
  _url: string = null;
  _db: string = null;
  _user: string = null;
  _uid: number = 2;
  _password: string = null;
  _api: ApisauceInstance = null;

  constructor(url: string, db: string) {
    this._url = url;
    this._db = db;
    this._createDefaultApiObject();
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
  }

}
