import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  artPiece: belongsTo('art-piece'),
  owner: attr('string'),
  showDescription: attr('boolean')
});
