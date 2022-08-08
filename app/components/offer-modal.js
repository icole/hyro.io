import { tagName } from "@ember-decorators/component";
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject } from '@ember/service';
import Component from "@ember/component";

@tagName("")
@classic
export default class OfferModal extends Component {
  @inject("web3") web3;
  @inject("current-user") currentUser;

  offerPlaced = false;
  offerProcessing = false;
  offerAmount = null;
  offerResult = null;

  @computed('offerResult.transactionHash')
  get ethscanLink() {
    return `https://rinkeby.etherscan.io/tx/${this.get("offerResult.transactionHash")}`;
  }

  @computed("offerAmount")
  get calculatedPayout() {
    let offerAmount = this.offerAmount;
    if (offerAmount !== null) {
      return parseFloat((offerAmount * 0.9).toPrecision(10).toString());
    } else {
      return null;
    }
  }

  @computed('editionOffered.highestBid', 'offerAmount')
  get offerMetBid() {
    const offer = parseFloat(this.offerAmount);
    const bid = parseFloat(this.get("editionOffered.highestBid"));
    return bid > 0 && offer > 0 && offer <= bid;
  }

  @computed('editionOffered.highestBid', 'highestBid')
  get minOffer() {
    return this.get("editionOffered.highestBid") > 0 ? this.get("editionOffered.highestBid") : 0;
  }

  @action
  toggleOfferModal() {
    this.toggleProperty("isShowingOfferModal");
  }

  @action
  async placeOffer() {
    let web3 = this.web3;
    let contract = web3.get("contract");
    let marketplaceContract = web3.get("marketplaceContract");
    let offerAmount = parseFloat(this.offerAmount);
    let artPieceId = this.get("editionOffered.artPiece.id");
    let edition = this.get("editionOffered.edition");
    await this.currentUser.load();

    if (contract) {
      if (offerAmount) {
        this.set("offerProcessing", true);

        try {
          let galleryInstance = await contract.deployed();
          let marketplaceInstance = await marketplaceContract.deployed();
          let latestWatched = await web3.get("web3Instance").eth.getBlockNumber(console.log);
          let offerEvent = marketplaceInstance.LogOfferPlaced({}, { fromBlock: latestWatched, toBlock: "latest" });
          let saleEvent = marketplaceInstance.LogOfferMet({}, { fromBlock: latestWatched, toBlock: "latest" });
          let self = this;
          offerEvent.watch(async function (error, result) {
            if (self.get("offerResult") && self.get("offerResult.tx") == result.transactionHash) {
              let artPiece = self.get("editionOffered.artPiece");
              let highestBid = await galleryInstance.highestBid(artPiece.get("id"));
              let highestEditionBid = await galleryInstance.highestEditionBid(artPiece.get("id"), edition);
              let lowestOffer = await galleryInstance.lowestOffer(artPiece.get("id"));
              highestBid = web3.get("web3Instance").fromWei(parseFloat(highestBid), "ether");
              lowestOffer = web3.get("web3Instance").fromWei(parseFloat(lowestOffer), "ether");
              artPiece.set("highestBid", highestBid);
              artPiece.set("lowestOffer", lowestOffer);
              self.set("editionOffered.highestBid", highestEditionBid);
              self.set("editionOffered.offerAmount", offerAmount);
              self.set("offerProcessing", false);
              self.set("offerPlaced", true);
              self.set("offerResult", null);
            }
          });
          saleEvent.watch(async function (error, result) {
            if (self.get("offerResult") && self.get("offerResult.tx") == result.transactionHash) {
              let artPiece = self.get("editionOffered.artPiece");
              let highestBid = await galleryInstance.highestBid(artPiece.get("id"));
              let highestEditionBid = await galleryInstance.highestEditionBid(artPiece.get("id"), edition);
              let lowestOffer = await galleryInstance.lowestOffer(artPiece.get("id"));
              highestBid = web3.get("web3Instance").fromWei(parseFloat(highestBid), "ether");
              lowestOffer = web3.get("web3Instance").fromWei(parseFloat(lowestOffer), "ether");
              artPiece.set("highestBid", highestBid);
              artPiece.set("lowestOffer", lowestOffer);
              self.set("editionOffered.highestBid", highestEditionBid);
              self.set("editionOffered.offerAmount", null);
              self.set("offerProcessing", false);
              self.set("offerPlaced", true);
              self.set("offerResult", null);
              self.get("editionOffered").deleteRecord();
            }
          });
          let offerResult = await galleryInstance.placeOffer(
            web3.get("web3Instance").toWei(offerAmount, "ether"),
            artPieceId,
            edition,
            {
              from: web3.get("account"),
              gas: 500000,
            }
          );
          this.set("offerResult", offerResult);
        } catch (err) {
          console.error("Offer creation failed");
          console.error(err);
          this.set("offerProcessing", false);
        }
      }
    } else {
      this.transitionToRoute("sign-in");
    }
  }

  @action
  changeOffer() {
    this.set("offerPlaced", false);
  }

  @action
  restrictAmount() {
    if ([69, 187, 189].includes(event.keyCode)) {
      event.preventDefault();
    }
  }

  @action
  validateAmount() {
    let newAmount = this.offerAmount;
    if (!newAmount.split(".")[0] && newAmount.split(".")[1]) {
      newAmount = "0" + newAmount;
    }
    newAmount = parseFloat(newAmount);
    let highestBid = this.get("editionOffered.highestBid");
    if (highestBid > 0 && newAmount < highestBid) {
      newAmount = highestBid;
    }
    if (/^([0-9].[0-9]{10,})$/.test(newAmount)) {
      newAmount = newAmount.toFixed(10);
    }
    if (newAmount.toString === "0") {
      newAmount = null;
    }
    this.set("offerAmount", newAmount);
  }
}
