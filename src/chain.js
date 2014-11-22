'use strict';

function arr (args) {
  return [].slice.call(args);
}

/**
 * Accepts a list of arguments to call in the order they are defined.
 *
 * @return {Function}
 */
export default function () {
  var callbacks = arr(arguments);

  return function () {
    var args = arr(arguments);
    var context = this;

    callbacks.forEach(function (callback) {
      callback.apply(context, args);
    });
  }
}
