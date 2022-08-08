import classic from 'ember-classic-decorator';
import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

@classic
export default class DisplayPiece extends Model {
  @belongsTo('art-piece')
  artPiece;

  @attr('string')
  owner;

  @attr('boolean')
  showDescription;
}
