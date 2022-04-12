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

  // Seller
  let account1 = accounts[0];

  // Independent Buyer
  let account2 = accounts[1];

  // Let us consider that these two accounts are working together
  let account3 = accounts[2];
  let account4 = accounts[3];

  before(async function() {
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    galleryInstance = await HyroGallery.deployed();
  })

  describe("#buyCorrectEdition", function() {
    it("should use the oldest bid that meets an offer", async () => {
      // Base price of .15 Eth and one edition
      await galleryInstance.addArtPiece(artPieceId1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 1, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');

      // User1 claim the artpiece
      let tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      await galleryInstance.claimPiece(artPieceId1, 1, {from: account1, value: web3.toWei(0.15, "ether")});
      tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      assert.equal(tokenCount.valueOf(), '1', "balance should be 1");

      // User3 sets bid for artpiece
      // User3 speculates that the piece is worth 1ETH
      await galleryInstance.placeBid(artPieceId1, 1, {from: account3, value: web3.toWei(1, "ether")});
      let bidCount = await hyroMarketplaceInstance.allBidCount({from: account3});
      assert.equal(bidCount.valueOf(), '1', "bid count should be 1");

      // User2 sets higher bid
      // User2 sees User3's offer, and thinks the art is worth 3ETH
      await galleryInstance.placeBid(artPieceId1, 1, {from: account2, value: web3.toWei(3, "ether")});
      bidCount = await hyroMarketplaceInstance.allBidCount({from: account2});
      assert.equal(bidCount.valueOf(), '2', "bid count should be 2");

      // User4, owned by User3, places the same bid
      // User4, who is working with User3, places the same bid as User2. This
      // shouldn't be an issue, but because the bids should clear in temporal
      // order, we can abuse the delete mecahnic to push User4's bid to
      // the front of the list
      await galleryInstance.placeBid(artPieceId1, 1, {from: account4, value: web3.toWei(3, "ether")});
      bidCount = await hyroMarketplaceInstance.allBidCount({from: account4});
      assert.equal(bidCount.valueOf(), '3', "bid count should be 3");
      await galleryInstance.deleteBid(artPieceId1, 1, {from: account3});
      bidCount = await hyroMarketplaceInstance.allBidCount({from: account3});
      assert.equal(bidCount.valueOf(), '2', "bid count should be 2");

      // User1 places offer at 3ETH, and User2 should win since its the old
      await galleryInstance.placeOffer(web3.toWei(3, "ether"), artPieceId1, 1, {from: account1});
      tokenCount = await galleryInstance.tokenCountOfOwner(account4);
      assert.equal(tokenCount.valueOf(), '0', "user4 balance should be 0");
      tokenCount = await galleryInstance.tokenCountOfOwner(account2);
      assert.equal(tokenCount.valueOf(), '1', "user2 balance should be 1");
    });
  })
});
