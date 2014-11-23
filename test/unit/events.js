'use strict';

import helpers from '../lib/helpers';
import events from '../../src/public/events';

describe('Events', function () {
  var div;

  beforeEach(function () {
    div = document.createElement('div');
  });

  it('should bind events', function () {
    var numTriggered = 0;

    events({
      test: function () {
        ++numTriggered;
      }
    })(div);

    helpers.dispatchEvent('test', div);
    expect(numTriggered).to.equal(1);
  });

  it('should bind to the component element', function () {
    var numTriggered = 0;

    events({
      'test div' : function () {
        ++numTriggered;
      }
    })(div);

    helpers.dispatchEvent('test', div);
    expect(numTriggered).to.equal(1);
  });

  it('should allow you to re-add the element back into the DOM', function () {
    var numTriggered = 0;

    events({
      test: function () {
        ++numTriggered;
      }
    })(div);

    document.body.appendChild(div);
    var par = div.parentNode;
    par.removeChild(div);
    par.appendChild(div);
    helpers.dispatchEvent('test', div);
    expect(numTriggered).to.equal(1);
  });

  it('should support delegate events', function () {
    var dispatched = 0;

    events({
      'click': function (element, e) {
        ++dispatched;
        expect(element.tagName).to.equal('DIV');
        expect(e.target.tagName).to.equal('SPAN');
      },
      'click a': function (element, e, current) {
        ++dispatched;
        expect(element.tagName).to.equal('DIV');
        expect(current.tagName).to.equal('A');
        expect(e.target.tagName).to.equal('SPAN');
      },
      'click span': function (element, e) {
        ++dispatched;
        expect(element.tagName).to.equal('DIV');
        expect(e.target.tagName).to.equal('SPAN');
      }
    })(div);

    var a = document.createElement('a');
    var span = document.createElement('span');

    div.appendChild(a);
    a.appendChild(span);

    helpers.dispatchEvent('click', span);
    expect(dispatched).to.equal(3);
  });

  it('should support delegate blur and focus events', function () {
    var blur = false;
    var focus = false;

    events({
      'blur input': function () {
        blur = true;
      },

      'focus input': function () {
        focus = true;
      }
    })(div);

    var input = document.createElement('input');
    div.appendChild(input);

    helpers.dispatchEvent('blur', input);
    expect(blur).to.equal(true);

    helpers.dispatchEvent('focus', input);
    expect(focus).to.equal(true);
  });
});
