import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

@classic
export default class IndexRoute extends Route {
  @service store;
  async model() {
    return this.store.findAll('gallery');
  }
}
