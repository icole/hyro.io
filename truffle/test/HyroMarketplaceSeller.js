require('chai')
.use(require('chai-as-promised'))
.should();

// Contract to be tested
let HyroMarketplace = artifacts.require("./HyroMarketplace.sol");

// Art Gallery contract
let HyroGallery = artifacts.require("./HyroGallery.sol");

contract('HyroMarketplace', function (accounts) {
  let hyroMarketplaceInstance;
  let galleryInstance;
  let account1 = accounts[0];
  let account2 = accounts[1];
  let account3 = accounts[2];
  let account4 = accounts[3];
  let account5 = accounts[4];
  let artPieceId = 1;

  before(async function() {
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    galleryInstance = await HyroGallery.deployed();
    await galleryInstance.addArtPiece(1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 10, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
  })

  describe("Offer Side", function() {

    describe("#placeOffer", function() {
      it("should create a new offer record", async () => {
        await galleryInstance.claimPiece(artPieceId, 5, {from: account2, value: web3.toWei(0.15, "ether")});
        await galleryInstance.placeOffer(web3.toWei(1.0, "ether"), artPieceId, 5, {from: account2});
        let offerCount = await galleryInstance.offerCount({from: account2});
        assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
        await hyroMarketplaceInstance.deleteAllOffers(account2, {from: account1});
      });
  
      it("should reject non authorized addresses creating a new offer record", async () => {
        await hyroMarketplaceInstance.removeAuthorizedContract(galleryInstance.address);
        let offerAmount = web3.toWei(0.14, "ether");
        await galleryInstance.placeOffer(offerAmount, artPieceId, 5, {from: account2, value: offerAmount}).should.be.rejected;
        await hyroMarketplaceInstance.addAuthorizedContract(galleryInstance.address);
      });
  
      it("should claim a bid of the same amount of a new offer", async () => {
        await galleryInstance.placeBid(artPieceId, 1, {from: account3, value: web3.toWei(0.7, "ether")});
        let bidCount = await hyroMarketplaceInstance.allBidCount({from: account1});
        assert.equal(bidCount.valueOf(), '1', "bid count should be 1");
        await galleryInstance.claimPiece(artPieceId, 1, {from: account4, value: web3.toWei(0.15, "ether")});
        await galleryInstance.placeOffer(web3.toWei(0.5, "ether"), artPieceId, 1, {from: account4});
        bidCount = await galleryInstance.bidCount({from: account3});
        assert.equal(bidCount.valueOf(), '0', "bid count should be 0");
        let offerCount = await galleryInstance.offerCount({from: account4});
        assert.equal(offerCount.valueOf(), '0', "offer count should be 0");
        let bidderPieceCount = await galleryInstance.tokenCountOfOwner(account3);
        assert.equal(bidderPieceCount.valueOf(), '1', "owned tokens for buyer should be 1");
        let sellerPieceCount = await galleryInstance.tokenCountOfOwner(account4);
        assert.equal(sellerPieceCount.valueOf(), '0', "owned tokens for seller should be 0");
      });
  
      it("should create an updated offer record and remove any old ones", async () => {
        await galleryInstance.placeOffer(web3.toWei(0.8, "ether"), artPieceId, 1, {from: account3});
        await galleryInstance.placeOffer(web3.toWei(0.7, "ether"), artPieceId, 1, {from: account3});
        let offerCount = await galleryInstance.offerCount({from: account3});
        assert.equal(offerCount.valueOf(), '1', 'offer count should be 1');
        await hyroMarketplaceInstance.deleteAllOffers(account3, {from: account1});
        offerCount = await galleryInstance.offerCount({from: account3});
        assert.equal(offerCount.valueOf(), '0', 'offer count should be 0');
      });
  
      it("should not allow an offer for a piece the sender doesn't own", async () => {
        await galleryInstance.claimPiece(artPieceId, 2, {from: account4, value: web3.toWei(0.15, "ether")});
        await galleryInstance.placeOffer(web3.toWei(0.15, "ether"), artPieceId, 3, {from: account2}).should.be.rejected;
        let offerCount = await galleryInstance.offerCount();
        assert.equal(offerCount.valueOf(), '0', "offer count should be 0");
      });
  
      it("should not claim a bid lower than the new offer", async () => {
        await galleryInstance.placeBid(artPieceId, 1, {from: account1, value: web3.toWei(0.3, "ether")});
        let bidCount = await galleryInstance.bidCount({from: account1});
        assert.equal(bidCount.valueOf(), '1', "bid count should be 1");
        await galleryInstance.claimPiece(artPieceId, 3, {from: account2, value: web3.toWei(0.15, "ether")});
        await galleryInstance.placeOffer(web3.toWei(0.6, "ether"), artPieceId, 3, {from: account2});
        bidCount = await galleryInstance.bidCount({from: account1});
        assert.equal(bidCount.valueOf(), '1', "bid count should be 1");
        let offerCount = await galleryInstance.offerCount({from: account2});
        assert.equal(offerCount.valueOf(), '1', "offer count should be 1");
      });
  
      it("should pay the seller on a matching bid fulfillment", async () => {
        const originalBalance = web3.fromWei(web3.eth.getBalance(account5).toString(10), 'ether');
  
        // Clear out any previous payments to piece contract
        await galleryInstance.cashOutPayments({ from: account1 });
  
        // Claim initial piece
        const claimTx = await galleryInstance.claimPiece(artPieceId, 4, {from: account5, value: web3.toWei(0.15, "ether")});
  
        // Fetch claim tx and calculate gas ETH spent
        let tx = await web3.eth.getTransaction(claimTx.tx);
        let gasSpent = web3.fromWei(tx.gasPrice.mul(claimTx.receipt.gasUsed), 'ether');
  
        // Recalculate expected balance from original balance minius the bid and gas
        let newBalance = parseFloat(originalBalance) - (0.15 + parseFloat(gasSpent));
  
        // Check contract and bidder account balance
        assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0.15');
  
        let currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account5).toString(10), 'ether'));
        newBalance.should.be.closeTo(currentBalance, 0.0000000000001);
  
        // List an offer on the claimed piece
        let offerTx = await galleryInstance.placeOffer(web3.toWei(0.4, "ether"), artPieceId, 4, {from: account5});
  
        // Fetch bid tx and calculate gas ETH spent
        tx = await web3.eth.getTransaction(offerTx.tx);
        gasSpent = web3.fromWei(tx.gasPrice.mul(offerTx.receipt.gasUsed), 'ether');
  
        // Recalculate expected balance from original balance minius the bid and gas
        newBalance = parseFloat(newBalance) - parseFloat(gasSpent);
        currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account5).toString(10), 'ether'));
        newBalance.should.be.closeTo(currentBalance, 0.0000000000001);
  
        // Place a matching bid on the piece from another account
        await galleryInstance.placeBid(artPieceId, 4, {from: account4, value: web3.toWei(0.4, "ether")});
        let sellerPieceCount = await galleryInstance.tokenCountOfOwner(account5);
        assert.equal(sellerPieceCount.valueOf(), '0', "owned pieces for seller should be 0");
  
        // Recalculate expected balance with payout from fulfilled bid
        newBalance = (parseFloat(newBalance) + (0.4 * 0.9));
        currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account5).toString(10), 'ether'));
        newBalance.should.be.closeTo(currentBalance, 0.0000000000001);
      });
    });

    describe("#lowestOffer", function() {
      it("should return the lowest offer amount", async () => {
        await galleryInstance.placeOffer(web3.toWei(0.5, "ether"), artPieceId, 5, {from: account2});
        let lowestOffer = await galleryInstance.lowestOffer(artPieceId);
        assert.equal(web3.fromWei(lowestOffer.valueOf(), "ether"), "0.5", "lowest offer should be 0.5");
      });
    });
  });
});
