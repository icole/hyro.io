import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class MyCollectionRoute extends Route {
  //@service('current-user') currentUser;
  @service store;
  currentUser = {
    user: {
      id: 1
    }
  }

  async model() {
    //await this.currentUser.load();
    let galleryEditions = [await this.store.queryRecord('gallery-edition', {
      user: this.currentUser.user.id
    })];
    return galleryEditions;
  }
}
