import classic from 'ember-classic-decorator';
import { Model, attr, belongsTo } from '@ember/data';

@classic
export default class DisplayPiece extends Model {
  @belongsTo('art-piece') artPiece;
  @attr('string') owner;
  @attr('boolean') showDescription;
}
