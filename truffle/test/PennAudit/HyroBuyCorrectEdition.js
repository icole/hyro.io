/*
Author: Chris Williams
Github: chrsunwil
*/

require('chai')
.use(require('chai-as-promised'))
.should();

// Contract to be tested
let HyroMarketplace = artifacts.require("./HyroMarketplace.sol");

// Contract to be tested
let HyroGallery = artifacts.require("./HyroGallery.sol");

// Test suite
contract('HyroGallery', function(accounts) {
  let galleryInstance;
  let artPieceId1 = 1;
  let account1 = accounts[0];
  let account2 = accounts[1];
  let account3 = accounts[2];

  before(async function() {
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    galleryInstance = await HyroGallery.deployed();
  })

  describe("#buyCorrectEdition", function() {
    it("Should allow owner to add art piece with 3 editions", async () => {
      //Base price of .15 Eth and three editions
      await galleryInstance.addArtPiece(artPieceId1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 3, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
    });
    it("User1 claim both Editions", async () => {
      //Base price of .15 Eth and all editions
      let tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      await galleryInstance.claimPiece(artPieceId1, 1, {from: account1, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId1, 2, {from: account1, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId1, 3, {from: account1, value: web3.toWei(0.15, "ether")});
      tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      assert.equal(tokenCount.valueOf(), '3', "balance should be 3");
    });
    it("User1 sets offers for editions", async () => {
      //Offer edition1 for 1 eth, edition2 for 4 eth, edition3 for 8 eth
      await galleryInstance.placeOffer(web3.toWei(1, "ether"), artPieceId1, 1, {from: account1});
      await galleryInstance.placeOffer(web3.toWei(8, "ether"), artPieceId1, 3, {from: account1});
      await galleryInstance.placeOffer(web3.toWei(4, "ether"), artPieceId1, 2, {from: account1});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '3', "offer count should be 3");
    });
    it("User2 can't buy edition2 for 1 Eth", async () => {
      await galleryInstance.placeBid(artPieceId1, 2, {from: account2, value: web3.toWei(1, "ether")});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '3', "offer count should be 3");
    });
    it("User3 buys edition3 for 8 Eth", async () => {
      await galleryInstance.placeBid(artPieceId1, 3, {from: account3, value: web3.toWei(8, "ether")});
      let account3ownedEdition = (await galleryInstance.getOwnedEditions(account3))[1][0];
      assert.equal(account3ownedEdition.valueOf(), '3', "Should be Edition 3");
    });
  })
});
