import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

@classic
export default class ArtEdition extends Model {
  @attr('number')
  edition;

  @attr('number')
  highestBid;

  @attr('number')
  lowestOffer;

  @attr('number')
  bidAmount;

  @attr('number')
  offerAmount;

  @belongsTo('art-piece')
  artPiece;

  @computed('artPiece.claimed')
  get claimed() {
    return this.get('edition') <= this.get('artPiece.claimed');
  }
}
