import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class ArtEdition extends Model {
  @attr('number') edition;
  @attr('number') highestBid;
  @attr('number') lowestOffer;
  @attr('number') bidAmount;
  @attr('number') offerAmount;

  @belongsTo('art-piece') artPiece;

  @computed('artPiece.claimed', 'edition')
  get claimed() {
    return this.edition <= this.artPiece.claimed;
  }
}
