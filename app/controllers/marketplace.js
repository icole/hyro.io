import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  web3: inject('web3'),
  spinner: inject('spinner'),
  isShowingModal: false,
  bidPlaced: false,
  bidProcessing: false,
  bidAmount: null,
  bidPiece: null,
  highestBid: 0.0,
  lowestOffer: 0.0,
  pieceSorting: Object.freeze(['id']),
  orderedPieces: sort('model', 'pieceSorting'),

  actions: {
    toggleBidModal(artPiece) {
      //For right now we should create an art edition wrapper to keep this consistent with offers
      let artEdition = {
        artPiece: artPiece
      }
      this.set('bidPiece', artEdition);
      this.toggleProperty('isShowingBidModal');
    },
    bidAgain() {
      this.set('bidPlaced', false);
    }
  }
});
