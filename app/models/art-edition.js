import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  edition: attr('number'),
  highestBid: attr('number'),
  lowestOffer: attr('number'),
  bidAmount: attr('number'),
  offerAmount: attr('number'),
  artPiece: belongsTo('art-piece'),
  claimed: computed('artPiece.claimed', function() {
    return this.get('edition') <= this.get('artPiece.claimed');
  })
});
