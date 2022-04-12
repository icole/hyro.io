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
  let artPieceId = 1;
  let account1 = accounts[0];
  let account2 = accounts[1];
  let account3 = accounts[2];
  let account4 = accounts[3];
  let account5 = accounts[4];

  before(async function() {
    hyroMarketplaceInstance = await HyroMarketplace.deployed();
    galleryInstance = await HyroGallery.deployed();
    await galleryInstance.addArtPiece(1, 'TestArtist1', 'Test Art 1', web3.toWei(0.15, "ether"), 10, 'Qme14Ebq35kK9tXX3izaxsfQimae98KmEfQFwo6M6nUFvb');
  })

  describe("Bid Side", function() {

    describe("#placeBid", function() {
      it("should create a new bid record", async () => {
        let bidAmount = web3.toWei(0.14, "ether");
        await galleryInstance.placeBid(artPieceId, 1, {from: account1, value: bidAmount});
        let bidCount = await galleryInstance.bidCount();
        assert.equal(bidCount.valueOf(), '1', "bid count should be 1");
      });

      it("should reject bids for already owned editions", async () => {
        await galleryInstance.claimPiece(artPieceId, 1, {from: account2, value: web3.toWei(0.15, "ether")});
        let bidAmount = web3.toWei(0.14, "ether");
        await galleryInstance.placeBid(artPieceId, 1, {from: account2, value: bidAmount}).should.be.rejected;
      });

      it("should reject non authorized addresses creating a new bid record", async () => {
        await hyroMarketplaceInstance.removeAuthorizedContract(galleryInstance.address);
        let bidAmount = web3.toWei(0.14, "ether");
        await galleryInstance.placeBid(artPieceId, 1, {from: account1, value: bidAmount}).should.be.rejected;
        await hyroMarketplaceInstance.addAuthorizedContract(galleryInstance.address);
      });

      it("should create an updated bid record and remove any old ones", async () => {
        let bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '0', 'bid count should be 0');
        await galleryInstance.placeBid(artPieceId, 1, {from: account4, value: web3.toWei(0.2, "ether")});
        await galleryInstance.placeBid(artPieceId, 1, {from: account4, value: web3.toWei(0.1, "ether")});
        bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '1', 'bid count should be 1');
      });

      it("should store bid eth in marketplace contract", async () => {
        await galleryInstance.cashOutPayments({ from: account1 });
        await galleryInstance.placeBid(artPieceId, 1, {from: account1, value: web3.toWei(0.14, "ether")});
        assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0');
        assert.isAbove(parseInt(web3.eth.getBalance(hyroMarketplaceInstance.address)), 0);
      });

      it("should claim the lowest offer if bid is the same amount", async () => {
        // Claim ArtPiece 1 editions 2 & 3 and list offers for them
        await galleryInstance.claimPiece(artPieceId, 2, {from: account2, value: web3.toWei(0.15, "ether")});
        await galleryInstance.placeOffer(web3.toWei(0.4, "ether"), artPieceId, 2, {from: account2});
        await galleryInstance.claimPiece(artPieceId, 3, {from: account3, value: web3.toWei(0.15, "ether")});
        await galleryInstance.placeOffer(web3.toWei(0.5, "ether"), artPieceId, 3, {from: account3});
        let offerCount = await hyroMarketplaceInstance.allOfferCount({from: account1});
        assert.equal(offerCount.valueOf(), '2');

        // Perform matching bid
        await galleryInstance.placeBid(artPieceId, 2, {from: account4, value: web3.toWei(0.4, "ether")});
        offerCount = await galleryInstance.offerCount({from: account3});
        assert.equal(offerCount.valueOf(), '1');
        offerCount = await galleryInstance.offerCount({from: account2});
        assert.equal(offerCount.valueOf(), '0');
        let bidderTokenCount = await galleryInstance.tokenCountOfOwner(account4);
        assert.equal(bidderTokenCount.valueOf(), '1');
      });

      it("should refund the original bid amount to bidder on a bid change", async () => {
        const originalBalance = web3.fromWei(web3.eth.getBalance(account5).toString(10), 'ether');
        const firstBid = 0.14;
        const secondBid = 0.12;

        // Place initial bid
        const bidTx = await galleryInstance.placeBid(artPieceId, 1, {from: account5, value: web3.toWei(firstBid, "ether")});

        // Fetch bid tx and calculate gas ETH spent
        let tx = await web3.eth.getTransaction(bidTx.tx);
        let gasSpent = web3.fromWei(tx.gasPrice.mul(bidTx.receipt.gasUsed), 'ether');

        // Recalculate expected balance from original balance minius the bid and gas
        let newBalance = parseFloat(originalBalance) - (parseFloat(firstBid) + parseFloat(gasSpent));

        // Check contract and bidder acount balance
        await galleryInstance.cashOutPayments();
        assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0');
        assert.isAbove(parseInt(web3.eth.getBalance(hyroMarketplaceInstance.address)), 0);
        let currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account5).toString(10), 'ether'));
        newBalance.should.be.closeTo(currentBalance, 0.0000000000001);

        // Place a new updated bid from same account
        const newBidTx = await galleryInstance.placeBid(artPieceId, 1, {from: account5, value: web3.toWei(secondBid, "ether")});

        // Fetch bid tx and calculate gas ETH spent
        tx = await web3.eth.getTransaction(newBidTx.tx);
        gasSpent = web3.fromWei(tx.gasPrice.mul(newBidTx.receipt.gasUsed), 'ether');

        // Recalculate balance from previous balance minius the bid and gas
        newBalance = parseFloat(newBalance) - (secondBid + parseFloat(gasSpent));
        // Add in refunded first bid
        newBalance = newBalance + firstBid;

        // Check contract and bidder account balance
        assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0');
        assert.isAbove(parseInt(web3.eth.getBalance(hyroMarketplaceInstance.address)), 0);
        currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account5).toString(10), 'ether'));
        newBalance.should.be.closeTo(currentBalance, 0.0000000000001);
      });
    });

    describe("#highestBid", function() {
      it("should return the highest bid amount", async () => {
        await galleryInstance.placeBid(artPieceId, 2, {from: account2, value: web3.toWei(0.2, "ether")});
        await galleryInstance.placeBid(artPieceId, 2, {from: account3, value: web3.toWei(0.3, "ether")});
        let highestBid = await galleryInstance.highestBid(artPieceId);
        assert.equal(web3.fromWei(highestBid.valueOf(), "ether"), "0.3", "highest bid should be 0.3");
      });
    });

    describe("#deleteAllBids", function() {
      it("should clear all previous bid records", async () => {
        let bidAmount = web3.toWei(0.14, "ether");
        await galleryInstance.placeBid(artPieceId, 1, {from: account4, value: bidAmount});
        let bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '1', "bid count should be 1");
        await hyroMarketplaceInstance.deleteAllBids(account4, {from: account1});
        bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '0', "bid count should be 0");
      });
    });

    describe("#deleteBid", function() {
      it("should delete the bid record and return the ether", async () => {
        const originalBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account4).toString(10), 'ether'));
        const firstBid = 0.14;

        let currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account4).toString(10), 'ether'));
        originalBalance.should.be.closeTo(currentBalance, 0.0000000000001);

        // Place initial bid
        const bidTx = await galleryInstance.placeBid(artPieceId, 1, {from: account4, value: web3.toWei(firstBid, "ether")});
        let bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '1');

        // Fetch bid tx and calculate gas ETH spent
        let tx = await web3.eth.getTransaction(bidTx.tx);
        let gasSpent = web3.fromWei(tx.gasPrice.mul(bidTx.receipt.gasUsed), 'ether');

        // Recalculate expected balance from original balance minius the bid and gas
        let newBalance = parseFloat(originalBalance) - (firstBid + parseFloat(gasSpent));

        // Check contract and bidder acount balance
        assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0');
        assert.isAbove(parseInt(web3.eth.getBalance(hyroMarketplaceInstance.address)), 0);
        currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account4).toString(10), 'ether'));
        newBalance.should.be.closeTo(currentBalance, 0.0000000000001);

        // Delete the placed bid
        const deleteTx = await galleryInstance.deleteBid(artPieceId, 1, {from: account4});

        bidCount = await galleryInstance.bidCount({from: account4});
        assert.equal(bidCount.valueOf(), '0');

        // Fetch bid tx and calculate gas ETH spent
        tx = await web3.eth.getTransaction(deleteTx.tx);
        gasSpent = web3.fromWei(tx.gasPrice.mul(deleteTx.receipt.gasUsed), 'ether');

        // Recalculate balance from previous balance minius the gas
        newBalance = parseFloat(newBalance) - parseFloat(gasSpent);
        // Add in refunded first bid
        newBalance = newBalance + firstBid;

        // Check contract and bidder account balance
        assert.equal(web3.fromWei(web3.eth.getBalance(galleryInstance.address).toString(10), 'ether'), '0');
        assert.isAbove(parseInt(web3.eth.getBalance(hyroMarketplaceInstance.address)), 0);
        currentBalance = parseFloat(web3.fromWei(web3.eth.getBalance(account4).toString(10), 'ether'));
        newBalance.should.be.closeTo(currentBalance, 0.0000000000001);
      });
    });
  });
});
