import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  currentUser: inject('current-user'),
  store: inject('store'),

  async init() {
    await this.get('currentUser').load();
    let displayPiece = await this.get('store').findRecord('display-piece', this.get('currentUser').user.id);
    this.set('displayPiece', displayPiece);
    this._super(...arguments)
  },
}) ;
