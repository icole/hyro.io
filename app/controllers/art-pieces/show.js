import Controller from "@ember/controller";
import { inject } from "@ember/service";

export default Controller.extend({
  web3: inject("web3"),
  isShowingModal: false,
  bidPlaced: false,
  bidProcessing: false,
  bidAmount: null,
  bidPiece: null,
  highestBid: 0.0,
  lowestOffer: 0.0,

  actions: {
    toggleBidModal(artPiece) {
      //For right now we should create an art edition wrapper to keep this consistent with offers
      let artEdition = {
        artPiece: artPiece,
      };
      this.set("bidPiece", artEdition);
      this.toggleProperty("isShowingBidModal");
    },
    bidAgain() {
      this.set("bidPlaced", false);
    },
  },
});
