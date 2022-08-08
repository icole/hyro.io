import { tagName } from "@ember-decorators/component";
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject } from '@ember/service';
import Component from "@ember/component";
import { getOwner } from "@ember/application";

@tagName("")
@classic
export default class BidModal extends Component {
  @inject("web3") web3;
  @inject() router;

  bidPlaced = false;
  bidProcessing = false;
  bidAmount = null;
  bidResult = null;

  @computed('bidAmount', 'bidEdition.lowestOffer')
  get bidMetOffer() {
    const offer = parseFloat(this.get("bidEdition.lowestOffer"));
    const bid = parseFloat(this.bidAmount);
    return offer > 0 && offer <= bid;
  }

  @computed("bidEdition.lowestOffer")
  get maxBid() {
    return parseFloat(this.get("bidEdition.lowestOffer") > 0 ? this.get("bidEdition.lowestOffer") : null);
  }

  @action
  toggleBidModal() {
    this.toggleProperty("isShowingBidModal");
  }

  @action
  async placeBid() {
    let web3 = this.web3;
    let contract = web3.get("contract");
    let marketplaceContract = web3.get("marketplaceContract");
    let bidAmount = parseFloat(this.bidAmount);
    let artPieceId = this.get("bidEdition.artPiece.id");
    let edition = this.get("bidEdition.edition");

    if (contract) {
      if (bidAmount) {
        this.set("bidProcessing", true);

        try {
          let galleryInstance = await contract.deployed();
          let marketplaceInstance = await marketplaceContract.deployed();
          let latestWatched = await web3.get("web3Instance").eth.getBlockNumber(console.log);
          let bidEvent = marketplaceInstance.LogBidPlaced({}, { fromBlock: latestWatched, toBlock: "latest" });
          let saleEvent = marketplaceInstance.LogBidMet({}, { fromBlock: latestWatched, toBlock: "latest" });
          let self = this;
          bidEvent.watch(async function (error, result) {
            if (self.get("bidResult") && self.get("bidResult.tx") == result.transactionHash) {
              // Update marketplace data
              let highestEditionBid = await galleryInstance.highestEditionBid(artPieceId, edition);
              let lowestEditionOffer = await galleryInstance.lowestEditionOffer(artPieceId, edition);
              let highestBid = await galleryInstance.highestBid(artPieceId);
              let lowestOffer = await galleryInstance.lowestOffer(artPieceId);
              self.set(
                "bidEdition.highestBid",
                web3.get("web3Instance").fromWei(parseFloat(highestEditionBid), "ether")
              );
              self.set(
                "bidEdition.lowestOffer",
                web3.get("web3Instance").fromWei(parseFloat(lowestEditionOffer), "ether")
              );
              self.set(
                "bidEdition.artPiece.highestBid",
                web3.get("web3Instance").fromWei(parseFloat(highestBid), "ether")
              );
              self.set(
                "bidEdition.artPiece.lowestOffer",
                web3.get("web3Instance").fromWei(parseFloat(lowestOffer), "ether")
              );
              self.set("bidEdition.bidAmount", bidAmount);

              // Remove overlay and update modal
              self.set("bidProcessing", false);
              self.set("bidPlaced", true);
              self.set("bidResult", null);
            }
          });
          saleEvent.watch(async function (error, result) {
            if (self.get("bidResult") && self.get("bidResult.tx") == result.transactionHash) {
              self.set("bidProcessing", false);
              self.set("bidPlaced", true);
              self.set("bidResult", null);
              getOwner(self)
                .router
                .transitionTo("order-pending", { queryParams: { tx: result.transactionHash } });
            }
          });
          let bidResult = await galleryInstance.placeBid(artPieceId, edition, {
            from: web3.get("account"),
            value: web3.get("web3Instance").toWei(bidAmount, "ether"),
            gas: 500000,
          });
          this.set("bidResult", bidResult);
        } catch (err) {
          console.error("Bid creation failed");
          console.error(err);
          this.set("bidProcessing", false);
        }
      }
    } else {
      this.transitionToRoute("sign-in");
    }
  }

  @action
  bidAgain() {
    this.set("bidPlaced", false);
  }

  @action
  restrictAmount() {
    if ([69, 187, 189].includes(event.keyCode)) {
      event.preventDefault();
    }
  }

  @action
  validateAmount() {
    let newAmount = this.bidAmount;
    //@TODO Validate correct number format (e.g 0.1 not .1)
    newAmount = parseFloat(newAmount);
    let lowestOffer = this.get("bidEdition.lowestOffer");
    if (lowestOffer > 0 && newAmount > lowestOffer) {
      newAmount = lowestOffer;
    }
    if (/^([0-9].[0-9]{10,})$/.test(newAmount)) {
      newAmount = newAmount.toFixed(10);
    }
    this.set("bidAmount", newAmount);
  }
}
