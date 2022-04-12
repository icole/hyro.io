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
  let artPieceId2 = 2;
  let account1 = accounts[0];
  let account2 = accounts[1];
  let account3 = accounts[2];

  before(async function() {
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    galleryInstance = await HyroGallery.deployed();
  })

  describe("#buyCorrectArtPiece", function() {
    it("Should allow owner to add two art pieces", async () => {
      //Base price of .15 Eth and one edition
      await galleryInstance.addArtPiece(artPieceId1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 1, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
      await galleryInstance.addArtPiece(artPieceId2, 'TestArtist2', 'Test Art 2', web3.toWei(0.15, "ether"), 1, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
    });
    it("User1 claim both art pieces", async () => {
      //Base price of .15 Eth and only one edition
      let tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      await galleryInstance.claimPiece(artPieceId1, 1, {from: account1, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId2, 1, {from: account1, value: web3.toWei(0.15, "ether")});
      tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      assert.equal(tokenCount.valueOf(), '2', "balance should be 2");
    });
    it("User1 sets offers for both art pieces", async () => {
      //Offer art1 for 1 eth, art2 for 4 eth
      await galleryInstance.placeOffer(web3.toWei(1, "ether"), artPieceId1, 1, {from: account1});
      await galleryInstance.placeOffer(web3.toWei(4, "ether"), artPieceId2, 1, {from: account1});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '2', "offer count should be 2");
    });
    it("User2 can't buy art piece 2 for 1 Eth", async () => {
      //Offer art1 for 1 eth, art2 for 4 eth
      await galleryInstance.placeBid(artPieceId2, 1, {from: account2, value: web3.toWei(1, "ether")});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '2', "offer count should be 2");
    });
    it("User2 buys art piece 2 for 4 Eth", async () => {
      //Offer art1 for 1 eth, art2 for 4 eth
      await galleryInstance.placeBid(artPieceId2, 1, {from: account2, value: web3.toWei(4, "ether")});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
      let account2ownedArt = parseInt((await galleryInstance.getOwnedEditions(account2))[0][0]);
      assert.equal(account2ownedArt, artPieceId2, "Should be Art Piece 2");
    });
  })
});
