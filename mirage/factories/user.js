import { Factory } from 'miragejs';

export default Factory.extend({
  address() {
    return "0x0000000000000000000000";
  },

  email() {
    return "foo@bar.com";
  },

  username() {
    return "foobar";
  }
});
