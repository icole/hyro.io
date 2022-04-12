require('chai')
.use(require('chai-as-promised'))
.should();

// Contract to be tested
let HyroGallery = artifacts.require("./HyroGallery.sol");

// Test suite
contract('HyroGallery', function(accounts) {
  let galleryInstance;
  let artPieceId = 1;
  let account1 = accounts[0];
  let account2 = accounts[1];
  let account3 = accounts[2];

  before(async function() {
    galleryInstance = await HyroGallery.deployed();
  })

  describe("#addArtPiece", function() {
    it("should allow the owner to add new art piece data", async () => {
      await galleryInstance.addArtPiece(1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 50, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
    });
  })

  describe("#claimPiece", function() {
    it("should increase the contract eth balance after piece claim", async () => {
      assert.equal(web3.eth.getBalance(galleryInstance.address).toString(), '0');
      await galleryInstance.claimPiece(artPieceId, 7, {from: account1, value: web3.toWei(0.15, "ether")});
      assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0.15');
    });

    it("should increase the claimed counts after claiming a piece", async () => {
      let tokenCount = await galleryInstance.tokenCountOfOwner(account2);
      assert.equal(tokenCount.valueOf(), '0', "initial balance should be 0");
      let claimedCount = parseInt(await galleryInstance.totalClaimed(artPieceId));
      await galleryInstance.claimPiece(artPieceId, 1, {from: account2, value: web3.toWei(0.65, "ether")});
      tokenCount = await galleryInstance.tokenCountOfOwner(account2);
      assert.equal(tokenCount.valueOf(), '1', "balance should be 1");
      newClaimedCount = parseInt(await galleryInstance.totalClaimed(artPieceId));
      assert.equal(claimedCount + 1, newClaimedCount, "claimed count should increase by 1");
    });

    it("should fail on claiming a piece with an amount below minimum", async () => {
      await galleryInstance.claimPiece(artPieceId, 8, {from: account2, value: web3.toWei(0.05, "ether")}).should.be.rejected;
    });

    it("should fail on claiming a piece with insufficient funds", async () => {
      await galleryInstance.claimPiece(artPieceId, 9, {from: account2, value: web3.toWei(110.0, "ether")}).should.be.rejected;
    });

    it("should fail on edition beyond the specified amount", async () => {
      await galleryInstance.addArtPiece(2, 'TestArtist2', 'Test Art 2', web3.toWei(0.15, "ether"), 3, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
      await galleryInstance.claimPiece(2, 4, {from: account2, value: web3.toWei(0.15, "ether")}).should.be.rejected;
    });
  })

  describe("#transferFrom", function() {
    it("should succeed on transferring a claimed token", async () => {
      let ownedTokens = await galleryInstance.tokensOfOwner(account2);
      await galleryInstance.transferFrom(account2, account3, ownedTokens[0], {from: account2});
      let tokenCount = await galleryInstance.tokenCountOfOwner(account3);
      assert.equal(tokenCount.valueOf(), '1', "balance should be 1")
    });

    it("should fail on transferring an unclaimed token", async () => {
      let tokenId = await galleryInstance.generateId(artPieceId, 10);
      await galleryInstance.transferFrom(account2, account3, tokenId, {from: account2}).should.be.rejected;
    });
  })

  describe("#cashOutPayments", function() {
    it("should withdraw all eth from contract on cash out", async () => {
      assert.isAbove(parseInt(web3.eth.getBalance(galleryInstance.address)), 0);
      await galleryInstance.cashOutPayments({ from: account1 });
      assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0');
    });

    it("should reject cash out from non-owner", async () => {
      await galleryInstance.cashOutPayments({ from: account2 }).should.be.rejected;
    });
  })

  describe("#getOwnedEditions", function() {
    it("should return the art piece id and edition", async () => {
      await galleryInstance.claimPiece(artPieceId, 10, {from: account2, value: web3.toWei(0.15, "ether")});
      const pieceIdsAndEditions = await galleryInstance.getOwnedEditions(account2, { from: account2 });
      assert.equal(pieceIdsAndEditions[0][0], artPieceId);
      assert.equal(pieceIdsAndEditions[1][0], 10);
    });
  });

  describe("#setMarketplace", function() {
    it("should reject non-owner addresses from setting the marketplace", async () => {
      await galleryInstance.setMarketplace(0x000, {from: account2}).should.be.rejected;
    })

    it("should allow the owner address to set the marketplace", async () => {
      await galleryInstance.setMarketplace(0x000, {from: account1}).should.be.fulfilled;
    })
  })
});
