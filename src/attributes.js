'use strict';

import MutationObserver from './mutation-observer';

/**
 * Binds attribute listeners for the specified attribute handlers.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
export default function (attributes) {
  return function (target) {
    function triggerCallback (type, name, newValue, oldValue) {
      var callback;

      if (attributes && attributes[name] && typeof attributes[name][type] === 'function') {
        callback = attributes[name][type];
      } else if (attributes && typeof attributes[name] === 'function') {
        callback = attributes[name];
      } else if (typeof attributes === 'function') {
        callback = attributes;
      }

      // There may still not be a callback.
      if (callback) {
        callback(target, {
          type: type,
          name: name,
          newValue: newValue,
          oldValue: oldValue
        });
      }
    }

    var a;
    var attrs = target.attributes;
    var attrsCopy = [];
    var attrsLen = attrs.length;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var type;
        var name = mutation.attributeName;
        var attr = attrs[name];

        if (attr && mutation.oldValue === null) {
          type = 'created';
        } else if (attr && mutation.oldValue !== null) {
          type = 'updated';
        } else if (!attr) {
          type = 'removed';
        }

        triggerCallback(type, name, attr ? (attr.value || attr.nodeValue) : undefined, mutation.oldValue);
      });
    });

    observer.observe(target, {
      attributes: true,
      attributeOldValue: true
    });

    // This is actually faster than [].slice.call(attrs).
    for (a = 0; a < attrsLen; a++) {
      attrsCopy.push(attrs[a]);
    }

    // In default web components, attribute changes aren't triggered for
    // attributes that already exist on an element when it is bound. This sucks
    // when you want to reuse and separate code for attributes away from your
    // lifecycle callbacks. Skate will initialise each attribute by calling the
    // created callback for the attributes that already exist on the element.
    for (a = 0; a < attrsLen; a++) {
      var attr = attrsCopy[a];
      triggerCallback('created', attr.nodeName, (attr.value || attr.nodeValue));
    }
  };
}
