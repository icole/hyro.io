import { tagName } from "@ember-decorators/component";
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Component from "@ember/component";

@tagName("")
@classic
export default class ArtPiecePurchase extends Component {
  @inject("web3") web3;
  @inject("session") session;
  @inject("current-user") currentUser;
  @inject("router") router;

  orderProcessing = false;

  @action
  openArtistOverlay() {
    const artistOverlay = document.querySelector(".artist-overlay") || null;
    //let tmp = artistInfoButtons[i].closest('.item').dataset.artist;
    artistOverlay.querySelector("p.info").textContent = "This artist has chosen to remain anonymous.";
    artistOverlay.querySelector("p.big").textContent = "About the artist";
    artistOverlay.querySelector("div.more-info").innerHTML = "";
    artistOverlay.classList.add("active");
    artistOverlay.querySelector("div.close").addEventListener("click", function () {
      artistOverlay.classList.remove("active");
    });
  }

  @action
  openInfoModal() {
    const infoModal = document.querySelector(".info-overlay") || null;
    infoModal.classList.add("active");
    infoModal.querySelector(".bg").addEventListener("click", function () {
      infoModal.classList.remove("active");
    });
    infoModal.querySelector("a.close").addEventListener("click", function () {
      infoModal.classList.remove("active");
    });
  }

  @action
  async buyCurrentRelease() {
    let web3 = this.web3;
    let contract = web3.get("contract");
    let account = web3.get("account");
    let artPieceId = this.get("art-piece.id");
    let editionId = this.get("art-piece.nextEdition");
    await this.currentUser.load();

    if (contract && account) {
      this.set("orderProcessing", true);

      try {
        let galleryInstance = await contract.deployed();
        let latestWatched = await web3.get("web3Instance").eth.getBlockNumber(console.log);
        let claimEvent = galleryInstance.LogPieceClaimed(
          {},
          {
            fromBlock: latestWatched,
            toBlock: "latest",
          }
        );
        let self = this;
        claimEvent.watch(async function (error, result) {
          if (self.get("claimResult") && self.get("claimResult.tx") == result.transactionHash) {
            self.set("claimResult", null);
            self.get("router").transitionTo("order-pending", {
              queryParams: {
                tx: result.transactionHash,
              },
            });
          }
        });
        let claimResult = await galleryInstance.claimPiece(artPieceId, editionId, {
          from: account,
          value: web3.get("web3Instance").toWei(0.15, "ether"),
          gas: 500000,
        });
        this.set("claimResult", claimResult);
      } catch (err) {
        console.error(err);
      }
    } else {
      this.router.transitionTo("sign-in");
    }
  }

  @action
  redirectSignIn() {
    this.router.transitionTo("sign-in");
  }
}
