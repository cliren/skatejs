'use strict';

import globals from './globals';
import hasOwn from './has-own';

/**
 * Returns the class list for the specified element.
 *
 * @param {Element} element The element to get the class list for.
 *
 * @returns {ClassList | Array}
 */
function getClassList (element) {
  var classList = element.classList;

  if (classList) {
    return classList;
  }

  var attrs = element.attributes;

  return (attrs['class'] && attrs['class'].nodeValue.split(/\s+/)) || [];
}

/**
 * Returns whether or not the specified definition can be bound using the
 * specified type.
 *
 * @param {String} id The definition ID.
 * @param {String} type The definition type.
 *
 * @returns {Boolean}
 */
function isDefinitionOfType (id, type) {
  return hasOwn(globals.registry, id) && globals.registry[id].type.indexOf(type) > -1;
}

export default {
  /**
   * Clears everything from the registry.
   *
   * @returns {Object}
   */
  clear: function () {
    globals.registry = {};
    return this;
  },

  /**
   * Returns the definitions that apply to the given element.
   *
   * @param {Element} element The elemtn to get the definitions for.
   *
   * @returns {Array}
   */
  getForElement: function (element) {
    var attrs = element.attributes;
    var attrsLen = attrs.length;
    var definitions = [];
    var isAttr = attrs.is;
    var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    var tag = element.tagName.toLowerCase();
    var isAttrOrTag = isAttrValue || tag;
    var definition;
    var tagToExtend;

    if (isDefinitionOfType(isAttrOrTag, skate.types.TAG)) {
      definition = globals.registry[isAttrOrTag];
      tagToExtend = definition.extends;

      if (isAttrValue) {
        if (tag === tagToExtend) {
          definitions.push(definition);
        }
      } else if (!tagToExtend) {
        definitions.push(definition);
      }
    }

    for (var a = 0; a < attrsLen; a++) {
      var attr = attrs[a].nodeName;

      if (isDefinitionOfType(attr, skate.types.ATTR)) {
        definition = globals.registry[attr];
        tagToExtend = definition.extends;

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    var classList = getClassList(element);
    var classListLen = classList.length;

    for (var b = 0; b < classListLen; b++) {
      var className = classList[b];

      if (isDefinitionOfType(className, skate.types.CLASS)) {
        definition = globals.registry[className];
        tagToExtend = definition.extends;

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    return definitions;
  },

  /**
   * Returns whether or not a definition is registered for the specified id.
   *
   * @param {String} id The definition id to check for.
   *
   * @returns {Boolean}
   */
  has: function (id) {
    return hasOwn(globals.registry, id);
  },

  /**
   * Sets a definition in the registry if it does not already exist. If a
   * definition by the same name already exists an error is thrown.
   *
   * @param {String} id The id to give the definition.
   * @param {Object} definition The definition to register.
   *
   * @returns {Object}
   */
  set: function (id, definition) {
    if (this.has(id)) {
      throw new Error('A definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
    }

    globals.registry[id] = definition;

    return this;
  },

  /**
   * Removes the definition registed with a matching id. If a definition is not
   * registered then it doesn't do anything.
   *
   * @param {String} id The id of the definition to remove.
   *
   * @returns {Object}
   */
  remove: function (id) {
    if (this.has(id)) {
      delete globals.registry[id];
    }

    return this;
  }
};
