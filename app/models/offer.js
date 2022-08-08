import classic from 'ember-classic-decorator';
import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

@classic
export default class Offer extends Model {
  @attr('number')
  offerAmount;

  @attr('number')
  highestBid;

  @attr('number')
  edition;

  @belongsTo('art-piece')
  artPiece;
}