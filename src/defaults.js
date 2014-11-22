import types from './types';

/**
 * The default options for a definition.
 *
 * @var {Object}
 */
export default {
  // Restricts a particular definition to binding explicitly to an element with
  // a tag name that matches the specified value.
  extends: '',

  // The ID of the definition. This is automatically set in the `skate()`
  // function.
  id: '',

  // Properties and methods to add to each element.
  prototype: {},

  // The attribute name to add after calling the created() callback.
  resolvedAttribute: 'resolved',

  // The type of bindings to allow.
  type: types.ANY,

  // The attribute name to remove after calling the created() callback.
  unresolvedAttribute: 'unresolved'
};
