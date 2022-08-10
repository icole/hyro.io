import classic from 'ember-classic-decorator';
import { observes } from '@ember-decorators/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import '@ember/object';

@classic
export default class SignInRoute extends Route {
  web3 = {}
  //@service('web3') web3;
  @service store
  @observes('web3.account')
  accountObserver() {
    this.refresh();
  }

  model() {
    return this.store.findRecord('user', 1);
  }
}
