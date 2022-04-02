import Controller from '@ember/controller';
import { inject } from '@ember/service';

// @TODO Update this to newer library
//import ethUtil from 'npm:ethereumjs-util';
//import Eth from 'npm:ethjs';
//import buffer from 'npm:buffer';

export default Controller.extend({
  web3: inject('web3'),
  store: inject(),
  session: inject('session'),
  currentUser: inject('current-user'),

  actions: {
    async createUser() {
      let self = this;
      //let msg = ethUtil.bufferToHex(new buffer.Buffer('Hyro Sign In', 'utf8'));
      //let from = this.get('model.address');
      //let eth = new Eth(this.get('web3.web3Instance.currentProvider'));

      //let signed = await eth.personal_sign(msg, from);
      //this.set('model.password', signed);
      //console.log('Signed: ' + signed);
      this.get('model').save().then(function() {
        self.get('session').authenticate('authenticator:token', {
          strategy: "local",
          email: self.get('model.email'),
          password: self.get('model.password')
        });
        self.get('currentUser').load().then(function() {
          self.transitionToRoute('featured-piece');
        });
      }).catch(function(reason) {
        console.error(reason);
      });
    }
  }
});
