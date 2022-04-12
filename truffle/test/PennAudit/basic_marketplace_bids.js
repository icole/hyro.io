/*
Author: Terry Jo
Github: terrencejo
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
  const artPieceId2 = 2;
  const owner = accounts[0];
  const account2 = accounts[1];
  const account3 = accounts[2];
  const account4 = accounts[3];

  before(async function() {
    galleryInstance = await HyroGallery.deployed();
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
  })

  describe("Bid Side", function() {

    const bidAmount = web3.toWei(0.14, "ether");

    describe("placeBid", function() {
      it("should create a new bid and count", async () => {
        var bidCount = await hyroMarketplaceInstance.bidCount(account2);
        assert.equal(bidCount.valueOf(), '0', "bid count should be 0");
        await galleryInstance.placeBid(artPieceId, 1, {from: account2, value: bidAmount});
        bidCount = await hyroMarketplaceInstance.bidCount(account2);
        assert.equal(bidCount.valueOf(), '1', "bid count should be 1");
      });

      it("should reject non authorized addresses from creating bid", async () => {
        await hyroMarketplaceInstance.removeAuthorizedContract(account3);
        await hyroMarketplaceInstance.placeBid(artPieceId, 2, {from: account3, value: web3.toWei(0.14, "ether")}).should.be.rejected;
        await hyroMarketplaceInstance.addAuthorizedContract(account3);
      });

      it("should correctly do total bidCount", async () => {
        await galleryInstance.placeBid(artPieceId, 3, {from: account2, value: web3.toWei(1, "ether")});
        var bidCount = await hyroMarketplaceInstance.allBidCount();
        assert.equal(bidCount.valueOf(), '2', "bid count should be 2");
      });

      it("should remove any old bids", async () => {
        let bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '0', 'bid count should be 0');
        await galleryInstance.placeBid(artPieceId, 1, {from: account4, value: web3.toWei(0.2, "ether")});
        await galleryInstance.placeBid(artPieceId, 1, {from: account4, value: web3.toWei(0.1, "ether")});
        bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '1', 'bid count should be 1');
      });

    });

    describe("higherBid", function() {
      it("should return the highest bid amount", async () => {
        await galleryInstance.placeBid(artPieceId2, 1, {from: account2, value: web3.toWei(0.2, "ether")});
        await galleryInstance.placeBid(artPieceId2, 1, {from: account3, value: web3.toWei(0.3, "ether")});
        let highestBid = await galleryInstance.highestBid(artPieceId2);
        assert.equal(web3.fromWei(highestBid.valueOf(), "ether"), "0.3", "highest bid should be 0.3");
      });
    });

    describe("deleteAllBids", function() {
      it("should clear all previous bid records", async () => {
        const bidAmount = web3.toWei(0.14, "ether");
        await galleryInstance.placeBid(artPieceId, 5, {from: account4, value: bidAmount});
        let bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '2', "bid count should be 2");
        await hyroMarketplaceInstance.deleteAllBids(account4, {from: owner});
        const bidCount4 = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount4.valueOf(), '0', "bid count should be 0");
      });
    });

  })
});
