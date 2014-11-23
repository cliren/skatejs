'use strict';

import helpers from '../lib/helpers';
import observer from '../../src/private/document-observer';
import registry from '../../src/private/registry';

afterEach(function () {
  observer.unregister();
  registry.clear();
  helpers.fixture('');
});
