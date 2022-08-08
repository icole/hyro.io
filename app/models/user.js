import classic from 'ember-classic-decorator';
const { Model, attr } = '@ember/data';

@classic
export default class User extends Model {
  @attr('string') address;
  @attr('string') email;
  @attr('string') username;
  @attr('string') password;
}
