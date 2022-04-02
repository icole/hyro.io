import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  currentUser: inject('current-user'),
  store: inject('store'),

  async model() {
    await this.get('currentUser').load();
    return this.get('store').findRecord('display-piece', this.get('currentUser').user.id);
  }
});
