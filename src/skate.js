'use strict';

import debounce from './private/debounce';
import documentObserver from './private/document-observer';
import inherit from './private/inherit';
import initElements from './private/init-elements';
import registry from './private/registry';
import triggerCreated from './private/trigger-created';

import attributes from './public/attributes';
import chain from './public/chain';
import defaults from './public/defaults';
import events from './public/events';
import init from './public/init';
import types from './public/types';
import version from './public/version';

/**
 * Initialises all valid elements in the document. Ensures that it does not
 * happen more than once in the same execution.
 *
 * @returns {undefined}
 */
var initDocument = debounce(function () {
  initElements(document.getElementsByTagName('html'));
});

/**
 * Creates a constructor for the specified definition.
 *
 * @param {Object} definition The definition information to use for generating the constructor.
 *
 * @returns {Function} The element constructor.
 */
function makeElementConstructor (definition) {
  function CustomElement () {
    var element;
    var tagToExtend = definition.extends;
    var definitionId = definition.id;

    if (tagToExtend) {
      element = document.createElement(tagToExtend);
      element.setAttribute('is', definitionId);
    } else {
      element = document.createElement(definitionId);
    }

    // Ensure the definition prototype is up to date with the element's
    // prototype. This ensures that overwriting the element prototype still
    // works.
    definition.prototype = CustomElement.prototype;

    // If they use the constructor we don't have to wait until it's attached.
    triggerCreated(element, definition);

    return element;
  }

  // This allows modifications to the element prototype propagate to the
  // definition prototype.
  CustomElement.prototype = definition.prototype;

  return CustomElement;
}

// Public API
// ----------

/**
 * Creates a listener for the specified definition.
 *
 * @param {String} id The ID of the definition.
 * @param {Object | Function} definition The definition definition.
 *
 * @returns {Function} Constructor that returns a custom element.
 */
function skate (id, definition) {
  // Set any defaults that weren't passed.
  definition = inherit(definition || {}, skate.defaults);

  // Set the definition ID for reference later.
  definition.id = id;

  // Definitions of a particular type must be unique.
  if (registry.has(definition.id)) {
    throw new Error('A definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
  }

  // Register the definition.
  registry.set(definition.id, definition);

  // Initialise existing elements.
  initDocument();

  // Lazily initialise the document observer so we don't incur any overhead if
  // there's no definition listeners.
  documentObserver.register(definition.remove);

  // Only make and return an element constructor if it can be used as a custom
  // element.
  if (definition.type.indexOf(skate.types.TAG) > -1) {
    return makeElementConstructor(definition);
  }
}




// Exporting
// ---------

skate.attributes = attributes;
skate.chain = chain;
skate.defaults = defaults;
skate.events = events;
skate.init = init;
skate.types = types;
skate.version = version;

// Always export the global. We don't know how consumers are using it and what
// their environments are like. Doing this affords them the flexibility of
// using it in an environment where module and non-module code may co-exist.
window.skate = skate;

// AMD
if (typeof define === 'function') {
  define(function () {
    return skate;
  });
}

// CommonJS
if (typeof exports === 'object') {
  exports.default = skate;
}

// ES6
export default skate;
