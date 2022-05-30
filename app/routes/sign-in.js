import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { observer } from '@ember/object';

export default Route.extend({
  web3: inject('web3'),

  accountObserver: observer('web3.account', function () {
    this.refresh();
  }),

  model() {
    return this.store.findRecord('user', 1);
  }
});
