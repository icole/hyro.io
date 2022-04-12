var HyroGallery = artifacts.require("./HyroGallery.sol");
var HyroMarketplace = artifacts.require("./HyroMarketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(HyroMarketplace).then(function() {
    HyroGallery.deployed().then(function(gallery) {
      gallery.setMarketplace(HyroMarketplace.address);
    });
    HyroMarketplace.deployed().then(function(marketplace) {
      marketplace.addAuthorizedContract(HyroGallery.address);
    });
  });
};