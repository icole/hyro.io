import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class OrderPendingController extends Controller {
  queryParams = ['tx'];
  tx = null;

  @computed('tx')
  get ethscanLink() {
    return `https://rinkeby.etherscan.io/tx/${this.tx}`;
  }
}
