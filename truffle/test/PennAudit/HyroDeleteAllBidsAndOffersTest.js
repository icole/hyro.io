/*
Author: Chris Williams
Github: chrsunwil
*/

require('chai')
.use(require('chai-as-promised'))
.should();

// Contract to be tested
const HyroMarketplace = artifacts.require("./HyroMarketplace.sol");
const HyroGallery = artifacts.require("./HyroGallery.sol");
contract('HyroMarketplace', function(accounts) {
  var galleryInstance;
  var hyroMarketplaceInstance;
  const artPieceId = 1;
  const claimAmount = web3.toWei(0.15, "ether");
  const owner = accounts[0];
  const account2 = accounts[1];
  const account3 = accounts[2];
  const account4 = accounts[3];

  before(async function() {
    galleryInstance = await HyroGallery.deployed();
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    await galleryInstance.addArtPiece(1, 'TestArtist1', 'Test Art 1', claimAmount, 10, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
  })

  describe("Bid Side", function() {
    describe("deleteAllBids", function() {
      it("should clear all previous bid records", async () => {
        const bidAmount = web3.toWei(0.14, "ether");
        await galleryInstance.placeBid(artPieceId, 1, {from: account4, value: bidAmount});
        let bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '1', "bid count should be 1");
        await galleryInstance.placeBid(artPieceId, 2, {from: account4, value: bidAmount});
        bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '2', "bid count should be 2");
        await galleryInstance.placeBid(artPieceId, 3, {from: account4, value: bidAmount});
        bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '3', "bid count should be 3");
        await hyroMarketplaceInstance.deleteAllBids(account4);
        bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '0', "bid count should be 0");
      });
    });

  });

  describe("Offer Side", function() {
    describe("deleteAllOffers", function() {
      it("should clear all previous offer records", async () => {
        const offerAmount = web3.toWei(0.4, "ether");
        await galleryInstance.claimPiece(artPieceId, 1, {from: account4, value: claimAmount});
        await galleryInstance.placeOffer(offerAmount, artPieceId, 1, {from: account4});
        let offerCount = await galleryInstance.offerCount({from: account4});
        assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
        await galleryInstance.claimPiece(artPieceId, 2, {from: account4, value: claimAmount});
        await galleryInstance.placeOffer(offerAmount, artPieceId, 2, {from: account4});
        offerCount = await galleryInstance.offerCount({from: account4});
        assert.equal(offerCount.valueOf(), '2', "offer count should be 2");
        await galleryInstance.claimPiece(artPieceId, 3, {from: account4, value: claimAmount});
        await galleryInstance.placeOffer(offerAmount, artPieceId, 3, {from: account4});
        offerCount = await galleryInstance.offerCount({from: account4});
        assert.equal(offerCount.valueOf(), '3', "offer count should be 3");
        await hyroMarketplaceInstance.deleteAllOffers(account4);
        offerCount = await galleryInstance.offerCount({from: account4});
        assert.equal(offerCount.valueOf(), '0', "offer count should be 0");
      });
    });

  });
});
