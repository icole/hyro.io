import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  web3: inject('web3'),
  store: inject(),
  session: inject('session'),
  currentUser: inject('current-user'),

  actions: {
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
      await this.get('currentUser').load();
      this.transitionToRoute('featured-piece');
      //}).catch(function (reason) {
      //  console.error(reason);
      //});
    }
  }
});
