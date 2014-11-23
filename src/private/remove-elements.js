'use strict';

import data from './data';
import registry from './registry';

/**
 * Triggers the detached callback and sets a flag that allows the attached
 * callback to be called if the target is inserted again.
 *
 * @param {Element} target The element to trigger the callback on.
 * @param {Object} component The component definition.
 *
 * @returns {undefined}
 */
function triggerDetached (target, component) {
  if (component.detached) {
    component.detached(target);
  }

  data.set(target, component.id + ':lifecycle:attached', false);
}

/**
 * Triggers the remove lifecycle callback on all of the elements.
 *
 * @param {DOMNodeList} elements The elements to trigger the remove lifecycle
 * callback on.
 *
 * @returns {undefined}
 */
function removeElements (elements) {
  var len = elements.length;

  for (var a = 0; a < len; a++) {
    var element = elements[a];

    if (element.nodeType !== 1) {
      continue;
    }

    removeElements(element.childNodes);

    var definitions = registry.getForElement(element);
    var definitionsLen = definitions.length;

    for (var b = 0; b < definitionsLen; b++) {
      triggerDetached(element, definitions[b]);
    }
  }
}

export default removeElements;
