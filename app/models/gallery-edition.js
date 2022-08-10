import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class GalleryEdition extends Model {
  @attr('number') edition;
  @attr('string') owner;
  @attr('number') highestBid;
  @attr('number') lowestOffer;
  @attr('number') bidAmount;
  @attr('number') offerAmount;
  @belongsTo('art-piece') artPiece;
  @attr('string') claimedAt;
  @attr('string') txHash;

  @computed('claimedAt')
  get dateDisplay() {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(this.claimedAt).toLocaleDateString("en-US", options);
  }

  @computed('txHash')
  get ethscanLink() {
    return `https://rinkeby.etherscan.io/tx/${this.txHash}`;
  }
}
