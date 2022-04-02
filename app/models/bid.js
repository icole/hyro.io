import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  bidAmount: attr('number'),
  edition: attr('number'),
  artPiece: belongsTo('art-piece')
});