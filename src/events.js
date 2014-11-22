'use strict';

import { objEach } from './utils';

var elProto = window.HTMLElement.prototype;
var matchesSelector = (
  elProto.matches ||
  elProto.msMatchesSelector ||
  elProto.webkitMatchesSelector ||
  elProto.mozMatchesSelector ||
  elProto.oMatchesSelector
);

/**
 * Parses an event definition and returns information about it.
 *
 * @param {String} e The event to parse.
 *
 * @returns {Object]}
 */
function parseEvent (e) {
  var parts = e.split(' ');
  return {
    name: parts.shift(),
    delegate: parts.join(' ')
  };
}

/**
 * Binds event listeners for the specified event handlers.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
export default function (events) {
  return function (target) {
    function makeHandler (handler, delegate) {
      return function (e) {
        // If we're not delegating, trigger directly on the component element.
        if (!delegate) {
          return handler(target, e, target);
        }

        // If we're delegating, but the target doesn't match, then we've have
        // to go up the tree until we find a matching ancestor or stop at the
        // component element, or document. If a matching ancestor is found, the
        // handler is triggered on it.
        var current = e.target;

        while (current && current !== document && current !== target.parentNode) {
          if (matchesSelector.call(current, delegate)) {
            return handler(target, e, current);
          }

          current = current.parentNode;
        }
      };
    }

    objEach(events, function (handler, name) {
      var evt = parseEvent(name);
      var useCapture = !!evt.delegate && (evt.name === 'blur' || evt.name === 'focus');
      target.addEventListener(evt.name, makeHandler(handler, evt.delegate), useCapture);
    });
  }
}
