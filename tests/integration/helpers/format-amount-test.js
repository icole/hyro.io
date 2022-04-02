import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | format-amount', function(hooks) {
  setupRenderingTest(hooks);

  test('it shows placeholder N/A when value is 0', async function(assert) {
    this.set('inputValue', '0');

    await render(hbs`{{format-amount inputValue}}`);

    assert.dom(this.element).hasText('N/A');
  });

  test('it appends the eth icon after values greater than 0', async function(assert) {
    this.set('inputValue', '1');
    const ethIcon = "<img style=\"height: 26px\" src=\"/assets/images/eth.svg\" alt=\"\">";

    await render(hbs`{{format-amount inputValue}}`);

    assert.equal(this.element.innerHTML, '1' + ethIcon);
  });
});
