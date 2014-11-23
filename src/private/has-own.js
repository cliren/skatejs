'use strict';

/**
 * Checks {}.hasOwnProperty in a safe way.
 *
 * @param {Object} obj The object the property is on.
 * @param {String} key The object key to check.
 *
 * @returns {Boolean}
 */
export default function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
