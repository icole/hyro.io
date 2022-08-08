import classic from 'ember-classic-decorator';
import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

@classic
export default class Bid extends Model {
  @attr('number')
  bidAmount;

  @attr('number')
  edition;

  @belongsTo('art-piece')
  artPiece;
}