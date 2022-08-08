import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Controller from "@ember/controller";

@classic
export default class ShowController extends Controller {
  @inject("web3")
  web3;

  @inject("session")
  session;

  @inject("current-user")
  currentUser;

  orderProcessing = false;
  selectedPiece = null;

  @action
  updateSelectedPiece(pieceId) {
    let artPiece = this.store.peekRecord("art-piece", pieceId);
    this.set("selectedPiece", artPiece);
  }

  @action
  async buyCurrentRelease() {
    let web3 = this.get("web3");
    let contract = web3.get("contract");
    let account = web3.get("account");
    let artPieceId = this.get("model.id");
    let editionId = this.get("model.nextEdition");
    await this.get("currentUser").load();

    if (contract && account) {
      this.set("orderProcessing", true);

      try {
        let galleryInstance = await contract.deployed();
        let latestWatched = await web3.get("web3Instance").eth.getBlockNumber(console.log);
        let claimEvent = galleryInstance.LogPieceClaimed({}, { fromBlock: latestWatched, toBlock: "latest" });
        let self = this;
        claimEvent.watch(async function (error, result) {
          if (self.get("claimResult") && self.get("claimResult.tx") == result.transactionHash) {
            self.set("claimResult", null);
            self.transitionToRoute("order-pending", { queryParams: { tx: result.transactionHash } });
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
      this.transitionToRoute("sign-in");
    }
  }

  @action
  redirectSignIn() {
    this.transitionToRoute("sign-in");
  }
}
