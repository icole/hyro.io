import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  edition: attr('number'),
  owner: attr('string'),
  highestBid: attr('number'),
  lowestOffer: attr('number'),
  bidAmount: attr('number'),
  offerAmount: attr('number'),
  artPiece: belongsTo('art-piece'),
  claimedAt: attr('string'),
  txHash: attr('string'),
  dateDisplay: computed('claimedAt', function() {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(this.get('claimedAt')).toLocaleDateString("en-US", options);
  }),
  ethscanLink: computed('txHash', function() {
    return `https://rinkeby.etherscan.io/tx/${this.get('txHash')}`;
  }),
});
