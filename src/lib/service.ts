import { ApisauceInstance, create, HEADERS } from 'apisauce';
import LRU from 'lru-cache';

export function hash(str: string) {
  let hsh = 5381;
  let i = str.length;

  while (i) {
    hsh = (hsh * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hsh >>> 0;
}

export default class Service {
  _url: string;
  _api: ApisauceInstance;
  _params: Record<string, unknown> = null;
  _cache: LRU = null;
  _keyHashed = false;

  constructor(baseUrl: string, headers: HEADERS = null) {
    this._url = baseUrl;
    // console.log('****** Service URL set to ******', this._url);
    this._api = create({
      baseURL: baseUrl,
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
        const path = url + JSON.stringify(params);
        const key = this._keyHashed ? hash(path).toString() : path;
        // console.log('***** inside modified get ******');
        if (this._cache.has(key)) {
          const val = this._cache.get(key);
          const data = JSON.parse(val);
          console.log(`[CACHE  GET] ${key} ${val}`);
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
        const path =
          response.config.url + JSON.stringify(response.config.params);
        const key = this._keyHashed ? hash(path).toString() : path;
        const val = JSON.stringify(response.data);
        console.log(`[CACHE SAVE]${key} ${val}`);
        this._cache.set(key, val);
      }
    });
  }

  setCache(limit: number, keyAsHash = false) {
    this._cache = new LRU({
      max: limit,
      dispose(key, n) {
        console.log('======= dispose ==== ');
        console.log(key);
        console.log(n);
        // n.close();
      },
      maxAgeit: 1000 * 60 * 60,
    });
    this._keyHashed = keyAsHash;
  }

  setHeaders(headers: HEADERS) {
    this._api.setHeaders(headers);
  }

  setParams(params: Record<string, unknown>) {
    this._params = params;
  }

  get api(): ApisauceInstance {
    return this._api;
  }

  get(path = '/', params: Record<string, unknown> = null) {
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
