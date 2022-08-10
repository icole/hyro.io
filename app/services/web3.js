import classic from 'ember-classic-decorator';
// import { computed } from '@ember/object';
import Service, { inject } from "@ember/service";
// import config from "ember-get-config";
// import Web3 from "web3";
// import contract from "truffle-contract";

@classic
export default class Web3Service extends Service {
  // @inject("session") session;
  // @inject() router;
  // @inject() store;

  // web3Instance = null;
  // accounts = null;
  // account = null;
  // networkId = null;
  // contract = null;
  // marketplaceContract = null;

  // @computed("networkId")
  // get wrongNetwork() {
  //   return (
  //     config.environment === "production" &&
  //     this.networkId &&
  //     this.networkId !== "4"
  //   );
  // }

  // @computed("account", "web3Instance")
  // get locked() {
  //   return this.web3Instance && !this.account;
  // }

  // init() {
  //   super.init(...arguments);
  //   this.initUpdatePoll();
  // }

  // async initUpdatePoll() {
  //   let _this = this;
  //   let web3 = window.ethereum;
  //   if (typeof web3 !== "undefined") {
  //     let web3Instance = new Web3(web3);
  //     _this.set("web3Instance", web3Instance);
  //     _this.set("networkId", web3Instance.version.network);
  //     await window.ethereum.enable();
  //     _this.set("account", web3.selectedAddress);
  //     web3.on("accountsChanged", function (accounts) {
  //       console.log(accounts);
  //       if (
  //         _this.get("wrongNetwork") ||
  //         (_this.get("account") && _this.get("account") !== accounts[0])
  //       ) {
  //         _this.get("store").unloadAll();
  //         if (_this.get("session").get("isAuthenticated")) {
  //           _this.get("session").invalidate("authenticator:custom");
  //           _this.get("router").transitionTo("sign-in");
  //         }
  //       }
  //       _this.set("accounts", accounts);
  //       _this.set("account", accounts[0]);
  //     });
  //     if (!_this.get("contract")) {
  //       _this.instantiateGallery();
  //     }
  //     if (!_this.get("marketplaceContract")) {
  //       _this.instantiateMarketplace();
  //     }
  //   }
  // }

  // instantiateGallery() {
  //   let self = this;
  //   $.getJSON(
  //     config.APP.apiHost + config.APP.contractsPath + "HyroGallery.json",
  //     function (data) {
  //       let gallery = contract(data);
  //       gallery.setProvider(self.get("web3Instance").currentProvider);
  //       self.set("contract", gallery);
  //     }
  //   );
  // }

  // instantiateMarketplace() {
  //   let self = this;
  //   $.getJSON(
  //     config.APP.apiHost + config.APP.contractsPath + "HyroMarketplace.json",
  //     function (data) {
  //       const marketplaceJson = data;
  //       let marketplace = contract(marketplaceJson);
  //       marketplace.setProvider(self.get("web3Instance").currentProvider);
  //       self.set("marketplaceContract", marketplace);
  //     }
  //   );
  // }
}
