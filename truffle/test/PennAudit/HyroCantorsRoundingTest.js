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

  // Owner of artPiece1
  let account1 = accounts[0];

  // Owner of artPiece2
  let account2 = accounts[1];

  before(async function() {
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    galleryInstance = await HyroGallery.deployed();
    // Base price of .15 Eth
    await galleryInstance.addArtPiece(artPieceId1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 4, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
    await galleryInstance.addArtPiece(artPieceId2, 'TestArtist2', 'Test Art 2', web3.toWei(0.15, "ether"), 4, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
  })

  describe("#cantorRoundingAttack", function() {
    it("should implement the cantor algorithm for pieces and editions correctly", async () => {
      // User1 claims artpiece1, edition 3
      let tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      assert.equal(tokenCount.valueOf(), '0', "balance should be 0");
      await galleryInstance.claimPiece(artPieceId1, 3, {from: account1, value: web3.toWei(0.15, "ether")});
      tokenCount = await galleryInstance.tokenCountOfOwner(account1);
      assert.equal(tokenCount.valueOf(), '1', "balance should be 1");

      // User2 claims artpiece2, edition 2
      tokenCount = await galleryInstance.tokenCountOfOwner(account2);
      assert.equal(tokenCount.valueOf(), '0', "balance should be 0");
      await galleryInstance.claimPiece(artPieceId2, 2, {from: account2, value: web3.toWei(0.15, "ether")});
      tokenCount = await galleryInstance.tokenCountOfOwner(account2);
      assert.equal(tokenCount.valueOf(), '1', "balance should be 1");
    });
  })
});
