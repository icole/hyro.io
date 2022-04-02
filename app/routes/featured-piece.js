import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  web3: inject('web3'),

  model() {
    return this.store.findRecord('art-piece', 1);
  }
});
