import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Controller from "@ember/controller";

@classic
export default class ShowController extends Controller {
  @inject("web3")
  web3;

  isShowingModal = false;
  bidPlaced = false;
  bidProcessing = false;
  bidAmount = null;
  bidPiece = null;
  highestBid = 0.0;
  lowestOffer = 0.0;

  @action
  toggleBidModal(artPiece) {
    //For right now we should create an art edition wrapper to keep this consistent with offers
    let artEdition = {
      artPiece: artPiece,
    };
    this.set("bidPiece", artEdition);
    this.toggleProperty("isShowingBidModal");
  }

  @action
  bidAgain() {
    this.set("bidPlaced", false);
  }
}
