import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | order-pending', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:order-pending');
    assert.ok(route);
  });
});
