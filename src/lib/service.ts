import { create, ApisauceInstance, HEADERS } from 'apisauce';
import LRU from 'lru-cache';

// import RS from 'ramdasauce';
export class Service {
  _url: string;
  _api: ApisauceInstance;
  _params: object = null;
  _cache: LRU = null;

  constructor(url: string, headers: HEADERS = null) {
    this._url = url;
    // console.log('****** Service URL set to ******', this._url);
    this._api = create({
      baseURL: url,
      headers,
    });
    // attach a monitor that fires with each request
    // this._api.addRequestTransform((request) => {
    //   console.log('******** request sent *******', request);
    // });
    // change the get fn
    const originalGet = this._api.get;
    this._api.get = (url, params = {}) => {
      return new Promise((resolve) => {
        const key = url + JSON.stringify(params);
        // console.log('***** inside modified get ******');
        if (this._cache.has(key)) {
          const val = this._cache.get(key);
          const data = JSON.parse(val);
          console.log(`[CACHE GET] ${key} ${val}`);
          return resolve({
            ok: true,
            problem: null,
            originalError: null,
            data,
          });
        }
        return resolve(originalGet(url, params));
      });
    };

    this._api.addResponseTransform((response) => {
      // console.log('******** response received *******', response);
      // lets add the ressult to cache
      if (this._cache && response.ok) {
        const key =
          response.config.url + JSON.stringify(response.config.params);
        const val = JSON.stringify(response.data);
        console.log(`[CACHE SAVE] ${key} ${val}`);
        this._cache.set(key, val);
      }
    });
  }

  setCache(limit: number) {
    this._cache = new LRU({
      max: limit,
      dispose: function (key, n) {
        console.log('======= dispose ==== ');
        console.log(key);
        console.log(n);
        // n.close();
      },
      maxAgeit: 1000 * 60 * 60,
    });
  }

  setHeaders(headers: HEADERS) {
    this._api.setHeaders(headers);
  }

  setParams(params: object) {
    this._params = params;
  }

  get api(): ApisauceInstance {
    return this._api;
  }

  get(path: string = '/', params: object = null) {
    const p = {
      ...this._params,
      ...params,
    };
    return this._api.get(path, p);
    // .then(RS.dotPath('data'))
    // .then(JSON.stringify)
    // .then(console.log);
  }
}
