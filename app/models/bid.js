import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class Bid extends Model {
  @attr('number') bidAmount;
  @attr('number') edition;
  @belongsTo('art-piece') artPiece;
}