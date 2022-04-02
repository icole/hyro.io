import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  currentUser: inject('current-user'),
  store: inject('store'),

  async model() {
    await this.get('currentUser').load();
    let galleryEditions = await this.get('store').query('gallery-edition', {
      user: this.get('currentUser').user.id
    });
    return galleryEditions;
  }
});
