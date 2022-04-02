import Controller from '@ember/controller';
import { inject } from '@ember/service';
import ENV from '../config/environment';

export default Controller.extend({
  socketIOService: inject('socket-io'),
  spinnerShowing: false,
  spinner: inject('spinner'),

  /*
    Important note: The namespace is an implementation detail of the Socket.IO protocol...
    http://socket.io/docs/rooms-and-namespaces/#custom-namespaces
  */
  namespace: '',

  async init() {
    this._super(...arguments);

    const socket = this.get('socketIOService').socketFor(`${ENV.APP.apiHost}/`);
    socket.on('connect', this.onConnect, this);
    socket.on('display-pieces created', this.onMessage, this);
    socket.on('display-pieces updated', this.onMessage, this);
  },

  onConnect() {
    console.log("socket connect");
  },

  onMessage() {
    // This is executed within the ember run loop
    console.log("socket message");
    this.get('model').reload();
  },

  willDestroy() {
    const socket = this.get('socketIOService').socketFor(`${ENV.APP.apiHost}/`);
    socket.off('connect', this.onConnect);
    socket.off('message', this.onMessage);
  },
});
