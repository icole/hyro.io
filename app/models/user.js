import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  address: attr('string'),
  email: attr('string'),
  username: attr('string'),
  password: attr('string')
});
