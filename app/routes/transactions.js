import classic from 'ember-classic-decorator';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class TransactionsRoute extends Route {
  @inject('current-user')
  currentUser;

  async model() {
    await this.get('currentUser').load();
    let transactions = await this.store.query('transaction', {
      '$or[0][buyer]': this.get('currentUser').user.id,
      '$or[1][seller]': this.get('currentUser').user.id
    });
    return transactions;
  }
}
