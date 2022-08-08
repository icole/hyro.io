import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class SignInController extends Controller {
  @inject('web3') web3;
  @inject() store;
  @inject('session') session;
  @inject('current-user') currentUser;

  @action
  async createUser() {
    //let self = this;
    //let msg = ethUtil.bufferToHex(new buffer.Buffer('Hyro Sign In', 'utf8'));
    //let from = this.get('model.address');
    //let eth = new Eth(this.get('web3.web3Instance.currentProvider'));

    //let signed = await eth.personal_sign(msg, from);
    //this.set('model.password', signed);
    //console.log('Signed: ' + signed);
    //this.get('model').save().then(function () {
    //await this.get('session').authenticate('authenticator:token', {
    //  strategy: "local",
    //  email: this.get('model.email'),
    //  password: this.get('model.password')
    //});
    await this.currentUser.load();
    this.transitionToRoute('featured-piece');
    //}).catch(function (reason) {
    //  console.error(reason);
    //});
  }
}
