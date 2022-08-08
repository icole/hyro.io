import classic from 'ember-classic-decorator';
import DS from 'ember-data';

const { Model, attr } = DS;

@classic
export default class User extends Model {
  @attr('string')
  address;

  @attr('string')
  email;

  @attr('string')
  username;

  @attr('string')
  password;
}
