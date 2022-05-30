import Service, { inject } from '@ember/service';
//import { isEmpty } from '@ember/utils';
//import { resolve } from 'rsvp';
import JWT from 'ember-simple-auth-token/authenticators/jwt';

export default Service.extend({
  session: inject('session'),
  store: inject(),

  load() {
    //const token = this.get('session.data.authenticated.accessToken');
    //if (!isEmpty(token)) {
    //  const userId = this.getUserIdFromToken(token);
    const userId = 1;
    return this.get('store').find('user', userId).then((user) => {
      this.set('user', user);
    });
    //} else {
    //  return resolve();
    //}
  },

  getUserIdFromToken(token) {
    const jwt = new JWT();
    const tokenData = jwt.getTokenData(token);
    return tokenData['userId'];
  }
});
