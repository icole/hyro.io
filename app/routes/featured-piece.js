import classic from 'ember-classic-decorator';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class FeaturedPieceRoute extends Route {
  @inject('web3')
  web3;

  model() {
    return this.store.findRecord('art-piece', 1);
  }
}
