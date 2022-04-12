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
  let newMarketplaceInstance;

  let artPieceId = 1;
  let account1 = accounts[0];

  before(async function() {
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    galleryInstance = await HyroGallery.deployed();
  })

  describe("#upgradeTest", function() {
    it("Create new Marketplace", async () => {
      newMarketplaceInstance = await HyroMarketplace.new().should.not.be.rejected
    });
    it("Set new Marketplace address", async () => {
      await galleryInstance.setMarketplace(newMarketplaceInstance.address).should.not.be.rejected
    });
  })
});
