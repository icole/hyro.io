import classic from 'ember-classic-decorator';
import { Model, attr, belongsTo } from '@ember/data';

@classic
export default class Offer extends Model {
  @attr('number') offerAmount;
  @attr('number') highestBid;
  @attr('number') edition;
  @belongsTo('art-piece') artPiece;
}