import Component from "@ember/component";
import { inject } from "@ember/service";
import { computed } from "@ember/object";

export default Component.extend({
  web3: inject("web3"),
  currentUser: inject("current-user"),
  offerPlaced: false,
  offerProcessing: false,
  offerAmount: null,
  offerResult: null,

  ethscanLink: computed("offerResult", function () {
    return `https://rinkeby.etherscan.io/tx/${this.get("offerResult.transactionHash")}`;
  }),

  calculatedPayout: computed("offerAmount", function () {
    let offerAmount = this.get("offerAmount");
    if (offerAmount !== null) {
      return parseFloat((offerAmount * 0.9).toPrecision(10).toString());
    } else {
      return null;
    }
  }),

  offerMetBid: computed("offerAmount", function () {
    const offer = parseFloat(this.get("offerAmount"));
    const bid = parseFloat(this.get("editionOffered.highestBid"));
    return bid > 0 && offer > 0 && offer <= bid;
  }),

  minOffer: computed("highestBid", function () {
    return this.get("editionOffered.highestBid") > 0 ? this.get("editionOffered.highestBid") : 0;
  }),

  actions: {
    toggleOfferModal() {
      this.toggleProperty("isShowingOfferModal");
    },
    async placeOffer() {
      let web3 = this.get("web3");
      let contract = web3.get("contract");
      let marketplaceContract = web3.get("marketplaceContract");
      let offerAmount = parseFloat(this.get("offerAmount"));
      let artPieceId = this.get("editionOffered.artPiece.id");
      let edition = this.get("editionOffered.edition");
      await this.get("currentUser").load();

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
    },
    changeOffer() {
      this.set("offerPlaced", false);
    },
    restrictAmount() {
      if ([69, 187, 189].includes(event.keyCode)) {
        event.preventDefault();
      }
    },
    validateAmount() {
      let newAmount = this.get("offerAmount");
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
    },
  },
});
