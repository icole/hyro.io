import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  web3: inject('web3'),

  actions: {
    createUser() {
      this.get('createUser')();
    }
  }
});
