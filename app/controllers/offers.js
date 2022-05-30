import Controller from "@ember/controller";
import { inject } from "@ember/service";

export default Controller.extend({
  web3: inject("web3"),

  actions: {
    toggleOfferModal(offer) {
      this.set("editionOffered", offer);
      // Close the art piece data in case the edition gets sold and offer is removed
      this.set("pieceOffered", offer.get("artPiece"));
      this.toggleProperty("isShowingOfferModal");
    },
    async deleteOffer(offer) {
      let web3 = this.get("web3");
      let contract = web3.get("contract");
      let account = web3.get("account");
      if (contract && account) {
        try {
          let instance = await contract.deployed();
          await instance.deleteOffer(offer.get("artPiece.id"), offer.get("edition"), {
            from: account,
            gas: 500000,
          });
          offer.deleteRecord();
        } catch (error) {
          console.error(error);
        }
      }
    },
    enlargePiece(previewImage) {
      this.set("enlargedImage", previewImage);
      const galleryPopup = document.querySelector(".enlarge-overlay");
      galleryPopup.classList.add("active");

      // Close button and also close when you click the overlay
      galleryPopup.querySelector(".bg").addEventListener("click", function () {
        galleryPopup.classList.remove("active");
      });
      galleryPopup.querySelector("div.close").addEventListener("click", function () {
        galleryPopup.classList.remove("active");
      });
    },
  },
});
