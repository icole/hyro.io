export function initialize(application) {
  application.inject('route', 'web3', 'service:web3');
}

export default {
  initialize
};
