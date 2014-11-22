'use strict';

import chain from '../../src/chain';

describe('Chaining', function () {
  it('should chain calls', function () {
    var called = 0;
    var chained = chain(
      function () { ++called; },
      function () { ++called; }
    );

    chained();
    expect(called).to.equal(2);
  });

  it('should maintain order', function () {
    var called = [];
    var chained = chain(
      function () { called.push(0); },
      function () { called.push(1); }
    );

    chained();
    expect(called[0]).to.equal(0);
    expect(called[1]).to.equal(1);
  });

  it('should pass arguments as they are defined', function () {
    var chained = chain(
      function (arg0, arg1) {
        expect(arg0).to.equal(0);
        expect(arg1).to.equal(1);
      }
    );

    chained(0, 1);
  });
});
