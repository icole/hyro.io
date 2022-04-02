import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  currentUser: inject('current-user'),

  async model() {
    await this.get('currentUser').load();
    let transactions = await this.store.query('transaction', {
      '$or[0][buyer]': this.get('currentUser').user.id,
      '$or[1][seller]': this.get('currentUser').user.id
    });
    return transactions;
  }
});
