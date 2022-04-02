import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | marketplace', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:marketplace');
    assert.ok(route);
  });
});
