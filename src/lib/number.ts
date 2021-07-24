import { create } from 'apisauce';
import R from 'ramda';
import RS from 'ramdasauce';
import Realm from 'realm';

import ServiceSchema from '../models/service';

/**
 * Multiplies a value by 2. (Also a full example of TypeDoc's functionality.)
 *
 * ### Example (es module)
 * ```js
 * import { double } from 'typescript-starter'
 * console.log(double(4))
 * // => 8
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var double = require('typescript-starter').double;
 * console.log(double(4))
 * // => 8
 * ```
 *
 * @param value - Comment describing the `value` parameter.
 * @returns Comment describing the return type.
 * @anotherNote Some other value.
 */
export const double = (value: number) => {
  return value * 4;
};

export const getStatus = (url, user, password) => {
  Realm.open({ schema: [ServiceSchema] }).then((realm) => {
    const service = realm.objects('Service');
    if (service.length < 1) {
      realm.write(() => {
        realm.create('Service', {
          url,
          lastRoomsSynced: new Date(2000, 1, 1),
          user,
          password,
        });
      });
      // service = realm.objects('Service');
    }
    // lookup realm for the service url and last connected date
    const svc: any = service[0];
    console.log('====================================');
    console.log(svc.lastRoomsSynced, svc.url);
    console.log('====================================');
    // define the api
    const api = create({
      baseURL: `https://${svc.url}/api/v1`,
    });

    // attach a monitor that fires with each request
    api.addMonitor(
      R.pipe(
        RS.dotPath('headers.x-ratelimit-remaining'),
        // R.concat('Calls remaining this hour: '),
        console.log
      )
    );
    api
      .get(`/info`)
      .then(RS.dotPath('data'))
      // .then(R.concat('Latest Commit: '))
      .then(console.log);
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
    realm.close();
  });

  // api
  //   .post(`/login`, { user: 'eyal', password: '321eyal' })
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
  console.log('after thee login call');
};

/**
 * Raise the value of the first parameter to the power of the second using the
 * es7 exponentiation operator (`**`).
 *
 * ### Example (es module)
 * ```js
 * import { power } from 'typescript-starter'
 * console.log(power(2,3))
 * // => 8
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var power = require('typescript-starter').power;
 * console.log(power(2,3))
 * // => 8
 * ```
 * @param base - the base to exponentiate
 * @param exponent - the power to which to raise the base
 */
export const power = (base: number, exponent: number) => {
  /**
   * This es7 exponentiation operator is transpiled by TypeScript
   */
  return base ** exponent;
};
