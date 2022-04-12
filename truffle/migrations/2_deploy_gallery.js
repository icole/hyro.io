var HyroGallery = artifacts.require("./HyroGallery.sol");
var HyroMarketplace = artifacts.require("./HyroMarketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(HyroGallery).then(function() {
    HyroGallery.deployed().then(function(instance) {
      instance.addArtPiece(1, 'Anonymous', 'Perception', web3.utils.toWei('0.15'), 10, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
      instance.addArtPiece(2, 'Kasuma', 'Cliff', web3.utils.toWei('0.15'), 10, 'QmSbpkym3BDbWnqXArBfeR48CL2tt37gktwVJ4j6rdoTuS');
      instance.addArtPiece(3, 'Steve McGhee', 'Last Flight Home', web3.utils.toWei('0.15'), 10, 'QmWCsaYdTfxJpU834JeFbDtyRYrSnSmx9ZE8Jh95RCjG8V');
      instance.addArtPiece(4, 'Colin Ely', 'Archeon', web3.utils.toWei('0.15'), 10, 'QmTYWrnp7vfSTkQ5bS8THqmXCTPCmUdr36iZh3qDLeiE3u');
      instance.addArtPiece(5, 'Steve Johnson', 'Is This Abstract', web3.utils.toWei('0.15'), 10, 'QmPh8gTeYSwpSXGPfzFBETr1yJnBSUjDEbiFZPukR2icB7');
      instance.addArtPiece(6, 'Steve Johnson', 'Home', web3.utils.toWei('0.15'), 10, 'QmPq5qaZ3fBT4YVdz2L5rSzrFqK3gZZyNrWxkhMxor6poB');
      instance.addArtPiece(7, 'Steve Johnson', 'Summer', web3.utils.toWei('0.15'), 10, 'QmYF2Abhsum1FySgayXxjRxnY1aNxG9NJsAM5DsdqJYFdH');
    });
  });
};
