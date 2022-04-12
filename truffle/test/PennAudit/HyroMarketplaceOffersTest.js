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
    await galleryInstance.addArtPiece(artPieceId1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 1, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
    await galleryInstance.addArtPiece(artPieceId2, 'TestArtist2', 'Test Art 2', web3.toWei(0.15, "ether"), 4, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
  })

  describe("#testClaimingArtpieces", function() {
    it("Claim both art pieces", async () => {
      let tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      await galleryInstance.claimPiece(artPieceId1, 1, {from: account1, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId2, 1, {from: account1, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId2, 2, {from: account2, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId2, 3, {from: account3, value: web3.toWei(0.15, "ether")});
      tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      assert.equal(tokenCount.valueOf(), '2', "balance should be 2");
    });
  })
  describe("#placeOffer", function(){
    it("Test successful placeOffer", async () => {
      await galleryInstance.placeOffer(web3.toWei(1, "ether"), artPieceId1, 1, {from: account1});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
    });
    it("Test placing same offer again", async () => {
      await galleryInstance.placeOffer(web3.toWei(1, "ether"), artPieceId1, 1, {from: account1});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
    });
    it("Test placing offer from someone else", async () => {
      await galleryInstance.placeOffer(web3.toWei(1, "ether"), artPieceId1, 1, {from: account2}).should.be.rejected;
    });
    it("Test placing offer without charge", async () => {
      await galleryInstance.placeOffer(web3.toWei(0, "ether"), artPieceId2, 1, {from: account1}).should.be.rejected;
    });
  })
  describe("#deleteOffer",function(){
    it("Test sucessful deleteOffer", async () => {
      await galleryInstance.deleteOffer(artPieceId1, 1, {from: account1});
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '0', "offer count should be 0");
    });
    it("Test deleteOffer from someone else", async () => {
      await galleryInstance.placeOffer(web3.toWei(1, "ether"), artPieceId2, 1, {from: account1})
      let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
      assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
    });
  })
  describe("#lowestOffer",function(){
    it("Test lowestOffer", async () => {
      await galleryInstance.placeOffer(web3.toWei(3, "ether"), artPieceId2, 2, {from: account2})
      await galleryInstance.placeOffer(web3.toWei(4, "ether"), artPieceId2, 3, {from: account3})
      let lowest = (await hyroMarketplaceInstance.lowestOffer(artPieceId2))
      assert.equal(lowest.valueOf(), web3.toWei(1, "ether"), "Lowest offer is 1");
    });
  })
  describe("#getOffers",function(){
    it("Test getOffers", async () => {
      offerData = await hyroMarketplaceInstance.getOffers(account1)
      assert.equal(offerData[0][0].valueOf(), '2', "Artpiece 2");
      assert.equal(offerData[1][0].valueOf(), '1', "Edition 1");
      assert.equal(offerData[2][0].valueOf(), web3.toWei(1, "ether"), "Price of 1 ETH");
    });
  })
  describe("#offerCount",function(){
    it("Test offCount", async () => {
      let offerCount = await hyroMarketplaceInstance.offerCount(account1);
      assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
      offerCount = await hyroMarketplaceInstance.offerCount(account2);
      assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
      offerCount = await hyroMarketplaceInstance.offerCount(account3);
      assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
    });
  })
});
