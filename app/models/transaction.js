import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  amount: attr('number'),
  edition: attr('number'),
  tx_hash: attr('string'),
  tx_type: attr('string'),
  ethscanLink: computed('tx_hash', function() {
    return `https://rinkeby.etherscan.io/tx/${this.get('tx_hash')}`;
  }),
  typeDisplay: computed('tx_type', function() {
    return this.get('tx_type') ? this.get('tx_type').charAt(0).toUpperCase() + this.get('tx_type').slice(1) : '';
  }),
  createdAt: attr('string'),
  dateDisplay: computed('createdAt', function() {
    return new Date(this.get('createdAt')).toLocaleDateString();
  }),
  artPiece: belongsTo('art-piece'),
  user: belongsTo('user')
});
