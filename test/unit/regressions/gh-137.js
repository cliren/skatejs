'use strict';

import helpers from '../../lib/helpers';
import skate from '../../../src/skate';

describe('regressions/gh-137', function () {
  var tag;

  beforeEach(function () {
    tag = helpers.safeTagName('my-el');
    helpers.fixture('<my-el id="my-element-id"></my-el>', tag);
    skate(tag.safe);
  });

  it('should not overwrite the element\'s id', function (done) {
    helpers.afterMutations(function () {
      expect(helpers.fixture().querySelector(tag.safe).id).to.equal('my-element-id');
      done();
    });
  });
});
