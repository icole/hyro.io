import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { observer } from '@ember/object';

export default Route.extend({
  web3: inject('web3'),

  accountObserver: observer('web3.account', function() {
    this.refresh();
  }),

  async model() {
    let account = this.web3.account;
    if(account) {
      let self = this;
      return await this.store.findRecord('user', account).catch(function() {
        return self.store.createRecord('user', {
          address: account,
          email: '',
          username: ''
        });
      });
    }
    return null;
  }
});
