import classic from 'ember-classic-decorator';
import { observes } from '@ember-decorators/object';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import '@ember/object';

@classic
export default class SignInRoute extends Route {
  @inject('web3')
  web3;

  @observes('web3.account')
  accountObserver() {
    this.refresh();
  }

  model() {
    return this.store.findRecord('user', 1);
  }
}
