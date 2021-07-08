import { create } from 'apisauce';
import R from 'ramda';
// @ts-ignore  
import RS from 'ramdasauce';

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

export const getStatus = () => {
  // define the api
  const api = create({
    baseURL: 'https://api.github.com',
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

  // attach a monitor that fires with each request
  api.addMonitor(
    R.pipe(
      RS.dotPath('headers.x-ratelimit-remaining'),
      // R.concat('Calls remaining this hour: '),
      console.log
    )
  );
  const REPO = 'skellock/apisauce';
  // show the latest commit message
  api
    .get(`/repos/${REPO}/commits`)
    .then(RS.dotPath('data.0.commit.message'))
    // .then(R.concat('Latest Commit: '))
    .then(console.log);
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
