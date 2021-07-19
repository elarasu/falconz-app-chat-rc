import { create, ApisauceInstance } from 'apisauce';
import RS from 'ramdasauce';
export class Service {
  _url: string;
  _api: ApisauceInstance;
  _params: object;

  constructor(url: string) {
    this._url = url;
    console.log('****** Service URL set to ******', this._url);
    this._api = create({
      baseURL: url,
    });
    // attach a monitor that fires with each request
    this._api.addRequestTransform((request) => {
      console.log('******** request sent *******', request);
    });
  }

  setParams(params: object) {
    this._params = params;
  }

  get(path: string, params: object) {
    const p = {
      ...this._params,
      ...params,
    };
    this._api
      .get(path, p)
      .then(RS.dotPath('data'))
      .then(JSON.stringify)
      .then(console.log);
  }
}
