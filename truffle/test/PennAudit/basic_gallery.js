/*
Author: Terry Jo
Github: terrencejo
*/


require('chai')
.use(require('chai-as-promised'))
.should();

// Contract to be tested
const HyroGallery = artifacts.require("./HyroGallery.sol");

contract('HyroGallery', function(accounts) {
  var galleryInstance;
  const artPieceId1 = 1;
  const artPieceId2 = 2;
  const owner = accounts[0];
  const account2 = accounts[1];
  const account3 = accounts[2];

  before(async function() {
    galleryInstance = await HyroGallery.deployed();
  })

  describe("addArtPiece", function() {
    it("should allow the owner to add new art piece data", async () => {
      await galleryInstance.addArtPiece(1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 10, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
      await galleryInstance.addArtPiece(2, 'TestArtist2', 'Test Art 2', web3.toWei(0.15, "ether"), 10, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
    });

    it("should not allow non owner to add new art piece", async() => {
      try {
        await galleryInstance.addArtPiece(1, 'TestArtist3', 'Test Art 3', web3.toWei(0.15, "ether"), 10).call({from: account2});
        assert.fail("The contract should not allow non owners to add art pieces");
      } catch (err) {
        assert.isOk(true);
      }
    });
  })

  describe("claimArtPiece", function() {
    it("should increase the contract eth balance after claiming piece", async () => {
      assert.equal(web3.eth.getBalance(galleryInstance.address).toString(), '0');
      await galleryInstance.claimPiece(artPieceId1, 7, {from: owner, value: web3.toWei(0.15, "ether")});
      assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0.15');
    });

    it("should not be able to claim a nonexistent edition of an art piece", async () => {
      try {
        await galleryInstance.claimPiece(artPieceId1, 11, {from: owner, value: web3.toWei(0.15, "ether")});
        assert.fail("The contract should not allow claiming of non existent art piece edition");
      } catch (err) {
        assert.isOk(true);
      }
    });

    it("should not be able to claim art piece if not enough is sent", async () => {
      await galleryInstance.claimPiece(artPieceId1, 6, {from: owner, value: web3.toWei(0.11, "ether")}).should.be.rejected;
    });

    it("should not be able to claim same art piece twice", async () => {
      await galleryInstance.claimPiece(artPieceId1, 2, {from: owner, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId1, 2, {from: owner, value: web3.toWei(0.15, "ether")}).should.be.rejected;
    });
  //try cashing out while not adding piece yet
  //try cashing out without being owner
  //check no longer have art piece when it is claimed (owner can continue to cash out)
  })

  describe("cashOut", function() {
    it("should withdraw all eth from contract when cash out", async () => {
      await galleryInstance.cashOutPayments({ from: owner });
      assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0');
    });

    it("should not allow non-owner to cash out", async () => {
      await galleryInstance.cashOutPayments({ from: account2 }).should.be.rejected;
    });
  //try cashing out while not adding piece yet
  })

  describe("viewFunctions", function () {
    it("should get correct owned editions", async() => {
      await galleryInstance.claimPiece(artPieceId2, 8, {from: account2, value: web3.toWei(0.15, "ether")});
      await galleryInstance.claimPiece(artPieceId2, 9, {from: account2, value: web3.toWei(0.15, "ether")});
      const pieceIdsAndEditions = await galleryInstance.getOwnedEditions(account2, { from: account2 });
      assert.equal(pieceIdsAndEditions[0][0], 2);
      assert.equal(pieceIdsAndEditions[1][0], 8);
      assert.equal(pieceIdsAndEditions[1][1], 9);
    });

    it("should properly show total number of editions", async() => {
      const totalEditions = await galleryInstance.totalEditions(artPieceId1);
      assert.equal(totalEditions, 10);
    });
  })

});
