import classic from 'ember-classic-decorator';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class MyCollectionRoute extends Route {
  @inject('current-user')
  currentUser;

  async model() {
    await this.get('currentUser').load();
    let galleryEditions = [await this.store.queryRecord('gallery-edition', {
      user: this.get('currentUser').user.id
    })];
    return galleryEditions;
  }
}
