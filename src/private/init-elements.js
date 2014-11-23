'use strict';

import { ATTR_IGNORE } from './constants';
import data from './data';
import registry from './registry';
import triggerCreated from './trigger-created';

/**
 * Triggers the attached callback.
 *
 * @param {Element} target The element to call the callback on.
 * @param {Object} component The component definition.
 *
 * @returns {undefined}
 */
function triggerAttached (target, component) {
  if (data.get(target, component.id + ':lifecycle:attached')) {
    return;
  }

  data.set(target, component.id + ':lifecycle:attached', true);
  target.removeAttribute(component.unresolvedAttribute);
  target.setAttribute(component.resolvedAttribute, '');

  if (component.attached) {
    component.attached(target);
  }
}

/**
 * Initialises a set of elements.
 *
 * @param {DOMNodeList | Array} elements A traversable set of elements.
 *
 * @returns {undefined}
 */
function initElements (elements) {
  var elementsLen = elements.length;

  for (var a = 0; a < elementsLen; a++) {
    var element = elements[a];

    if (element.nodeType !== 1 || element.attributes[ATTR_IGNORE]) {
      continue;
    }

    var currentNodeDefinitions = registry.getForElement(element);
    var currentNodeDefinitionsLength = currentNodeDefinitions.length;

    for (var b = 0; b < currentNodeDefinitionsLength; b++) {
      triggerCreated(element, currentNodeDefinitions[b]);
      triggerAttached(element, currentNodeDefinitions[b]);
    }

    var elementChildNodes = element.childNodes;
    var elementChildNodesLen = elementChildNodes.length;

    if (elementChildNodesLen) {
      initElements(elementChildNodes);
    }
  }
}

export default initElements;
