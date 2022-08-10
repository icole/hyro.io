import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class FeaturedPieceRoute extends Route {
  @service('web3') web3;
  @service store;

  async model() {
    return this.store.findRecord('art-piece', 1);
  }
}
