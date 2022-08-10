import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class User extends Model {
  @attr('string') address;
  @attr('string') email;
  @attr('string') username;
  @attr('string') password;
}
