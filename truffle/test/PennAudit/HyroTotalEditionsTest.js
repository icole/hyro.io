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
    it("Create editions", async () => {
      //Base price of .15 Eth and three editions
      await galleryInstance.addArtPiece(artPieceId1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 3, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
    });
    it("Check number of editions", async () => {
      //Base price of .15 Eth and all editions
      assert.equal(await galleryInstance.totalEditions(1), 3, "balance should be 3");
    });
  })
});
