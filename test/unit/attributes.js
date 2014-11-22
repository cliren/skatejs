'use strict';

import helpers from '../lib/helpers';
import attributes from '../../src/attributes';

describe('Attribute listeners', function () {
  var div;

  beforeEach(function () {
    div = document.createElement('div');
  });

  it('should listen to changes in specified attributes', function (done) {
    var created = false;
    var updated = false;

    attributes({
      open: {
        created: function (element, data) {
          created = true;
          data.newValue.should.equal('created');
          element.setAttribute('open', 'updated');
        },
        updated: function (element, data) {
          updated = true;
          data.oldValue.should.equal('created');
          data.newValue.should.equal('updated');
          element.removeAttribute('open');
        },
        removed: function (element, data) {
          created.should.equal(true);
          updated.should.equal(true);
          data.oldValue.should.equal('updated');
          done();
        }
      }
    })(div);

    div.setAttribute('open', 'created');
  });

  it('should accept a function insead of an object for a particular attribute definition.', function (done) {
    attributes({
      open: function (element, data) {
        if (data.type === 'created') {
          element.setAttribute('open', 'updated');
        } else if (data.type === 'updated') {
          element.removeAttribute('open');
        } else if (data.type === 'removed') {
          assert(true);
          done();
        }
      }
    })(div);

    div.setAttribute('open', 'created');
  });

  it('should accept a function insead of an object for the entire attribute definition.', function (done) {
    attributes(function (element, data) {
      if (data.type === 'created') {
        setTimeout(function () {
          element.setAttribute('open', 'updated');
        });
      } else if (data.type === 'updated') {
        setTimeout(function () {
          element.removeAttribute('open');
        });
      } else if (data.type === 'removed') {
        assert(true);
        done();
      }
    })(div);

    div.setAttribute('open', 'created');
  });

  it('should ensure an attribute exists before trying to action it just in case another attribute handler removes it', function (done) {
    attributes(function (element, data) {
      if (data.name === 'first') {
        element.removeAttribute('second');
      }
    })(div);

    div.setAttribute('first', 'first');
    div.setAttribute('second', 'second');

    helpers.afterMutations(function () {
      div.hasAttribute('first').should.equal(true);
      div.hasAttribute('second').should.equal(false);
      done();
    });
  });

  it('should ensure attributes are initialised', function (done) {
    var called = false;

    attributes(function () {
      called = true;
    })(div);

    div.setAttribute('some-attr', 'true');

    helpers.afterMutations(function () {
      expect(called).to.equal(true);
      done();
    });
  });

  it('should iterate over every attribute even if one removed while it is still being processed', function (done) {
    var attributesCalled = 0;

    attributes({
      id: {
        created: function (element) {
          element.removeAttribute('id');
          attributesCalled++;
        }
      },
      name: {
        created: function (element) {
          element.removeAttribute('name');
          attributesCalled++;
        }
      }
    })(div);

    div.setAttribute('id', 'test');
    div.setAttribute('name', 'name');

    helpers.afterMutations(function () {
      expect(attributesCalled).to.equal(2);
      done();
    });
  });
});
