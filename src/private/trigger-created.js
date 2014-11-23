'use strict';

import data from './data';
import inherit from './inherit';

/**
 * Triggers the created lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
export default function (target, component) {
  if (data.get(target, component.id + ':lifecycle:created')) {
    return;
  }

  data.set(target, component.id + ':lifecycle:created', true);
  inherit(target, component.prototype, true);

  if (component.created) {
    component.created(target);
  }
}
