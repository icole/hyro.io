import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Component from '@ember/component';

@classic
export default class LogIn extends Component {
  @inject('web3')
  web3;

  @action
  createUser() {
    //this.get('createUser')();
  }
}
