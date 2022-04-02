import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['tx'],
  tx: null,

  ethscanLink: computed('tx', function() {
    return `https://rinkeby.etherscan.io/tx/${this.get('tx')}`;
  })
});
