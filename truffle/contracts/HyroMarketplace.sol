pragma solidity 0.4.24;

import "@0xcert/ethereum-erc721/contracts/tokens/NFToken.sol";
import "@0xcert/ethereum-utils/contracts/ownership/Ownable.sol";
import "./Destructible.sol";
import "./Pausable.sol";

/**
 * @title HyroMarketplace
 * @dev Marketplace for buying and selling Hyro art pieces
 */
contract HyroMarketplace is Destructible, Pausable {

  struct Bid {
    uint artPieceId;
    uint edition;
    address bidder;
    uint amount;
    uint timestamp;
  }

  struct Offer {
    uint tokenId;
    uint artPieceId;
    uint edition;
    address seller;
    uint amount;
    uint timestamp;
  }

  Bid[] internal _bids;
  Offer[] internal _offers;
  address[] internal _authorizedContracts;
  uint internal _commissionPercent = 10;
  uint internal _payoutPercent = 100 - _commissionPercent;
  uint internal MAX_UINT = 2**256 - 1;

  event LogBidPlaced(
    address indexed _buyer,
    uint indexed _artPieceId,
    uint _edition,
    uint _amount,
    uint _timestamp
  );

  event LogBidMet(
    address indexed _seller,
    address indexed _buyer,
    uint _tokenId,
    uint indexed _artPieceId,
    uint _edition,
    uint _amount,
    uint _payout
  );

  event LogOfferPlaced(
    address indexed _seller,
    uint _tokenId,
    uint indexed _artPieceId,
    uint _edition,
    uint _amount,
    uint _timestamp
  );

  event LogOfferMet(
    address indexed _seller,
    address indexed _buyer,
    uint _tokenId,
    uint indexed _artPieceId,
    uint _edition,
    uint _amount,
    uint _payout
  );

  constructor() public {}

  /**
   * @dev Check if message sender is an authorized contract or owner
   */
  modifier isAuthorized() {
    if(msg.sender != address(this) && msg.sender != owner) {
      bool found = false;
      for(uint i = 0; i < _authorizedContracts.length; i++) {
        if(_authorizedContracts[i] == msg.sender) {
          found = true;
        }
      }
      require(found, "Unauthorized caller");
    }
    _;
  }

  /**
   * @dev Allow access to sellable contract
   */
  function addAuthorizedContract(address _contractAddress) public onlyOwner {
    _authorizedContracts.push(_contractAddress);
  }

  /**
   * @dev Remove access from sellable contract
   */
  function removeAuthorizedContract(address _contractAddress) public onlyOwner {
    for(uint i = 0; i < _authorizedContracts.length; i++) {
      if(_authorizedContracts[i] == _contractAddress) {
        _authorizedContracts[i] = _authorizedContracts[_authorizedContracts.length-1];
        delete _authorizedContracts[_authorizedContracts.length-1];
        _authorizedContracts.length--;
        break;
      }
    }
  }

  /**
   * @dev Fallback function
   */
  function () public payable {
    revert("Fallback not allowed");
  }

  /**
   * @dev Authorized accessible functions
   */

  /**
   * @notice Request to place a pid on a particular requesting art piece
   */
  function placeBid(address _bidder, uint _artPieceId, uint _edition) external payable isAuthorized whenNotPaused {
    uint _amount = msg.value;
    require(_amount > 0, "Amount must be greater than 0");
    // Delete and refund any previously placed bids by same address
    _deleteBid(_bidder, _artPieceId, _edition);
    uint _foundOfferIndex = _findMatchingOffer(_artPieceId, _edition, _amount);

    // If a offer was found then process it:
    // -- Transfer the requested edition to the bidder
    // -- Transfer ETH bid to the seller placing the offer (minus a specified commission)
    // Else create and store a Bid record
    if(_foundOfferIndex < _offers.length) {
      _completeBid(_bidder, _amount, _foundOfferIndex);
    } else {
      Bid memory newBid = Bid({bidder: _bidder, amount: _amount, artPieceId: _artPieceId, edition: _edition, timestamp: now});
      _bids.push(newBid);
      emit LogBidPlaced(_bidder, _artPieceId, _edition, _amount, now);
    }
  }

  /**
   * @notice Request to place an offer for a particular owned edition of requesting art piece
   */
  function placeOffer(address _seller, uint _amount, uint _tokenId, uint _artPieceId, uint _edition) external isAuthorized whenNotPaused {
    require(_amount > 0, "Amount must be greater than 0");
    // Delete previously place offers by same address
    _deleteOffer(_seller, _artPieceId, _edition);
    uint _foundBidIndex = _findMatchingBid(_artPieceId, _edition, _amount);

    // If a bid was found then process it:
    // -- Transfer the requested edition to the bidder
    // -- Transfer ETH bid to the seller placing the offer (minus a specified commission)
    // Else create and store an Offer record
    if(_foundBidIndex < _bids.length) {
      _completeOffer(_seller, _tokenId, _foundBidIndex);
    } else {
      Offer memory newOffer = Offer({seller: _seller, amount: _amount, tokenId: _tokenId, artPieceId: _artPieceId, edition: _edition, timestamp: now});
      _offers.push(newOffer);
      emit LogOfferPlaced(_seller, _tokenId, _artPieceId, _edition, _amount, now);
    }
  }

  /**
   * @notice Total number of bids
   */
  function allBidCount() public view returns (uint) {
    return _bids.length;
  }

  /**
   * @notice Number of bids for a specific user
   */
  function bidCount(address bidder) public view isAuthorized returns (uint) {
    uint _bidCount = 0;
    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].bidder == bidder) {
        _bidCount++;
      }
    }
    return _bidCount;
  }

  /**
   * @notice Total number of offers
   */
  function allOfferCount() public view isAuthorized returns (uint) {
    return _offers.length;
  }

  /**
   * @notice Number of offers for a specific user
   */
  function offerCount(address seller) public view isAuthorized returns (uint) {
    uint _offerCount = 0;
    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].seller == seller) {
        _offerCount++;
      }
    }
    return _offerCount;
  }

  /**
   * @notice Highest bid amount for a specific art piece
   */
  function highestBid(uint artPieceId) public view isAuthorized returns (uint) {
    uint _highestBid = 0;
    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].artPieceId == artPieceId && (_highestBid == 0 || _bids[i].amount > _highestBid)) {
        _highestBid = _bids[i].amount;
      }
    }
    return _highestBid;
  }

  /**
   * @notice Highest bid amount for a specific art piece edition
   */
  function highestEditionBid(uint artPieceId, uint edition) public view isAuthorized returns (uint) {
    uint _highestBid = 0;
    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].artPieceId == artPieceId && _bids[i].edition == edition && (_highestBid == 0 || _bids[i].amount > _highestBid)) {
        _highestBid = _bids[i].amount;
      }
    }
    return _highestBid;
  }

  /**
   * @notice Lowest offer amount for a specific art piece
   */
  function lowestOffer(uint artPieceId) public view isAuthorized returns (uint) {
    uint _lowestOffer = 0;
    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].artPieceId == artPieceId && (_lowestOffer == 0 || _offers[i].amount < _lowestOffer)) {
        _lowestOffer = _offers[i].amount;
      }
    }
    return _lowestOffer;
  }

  /**
   * @notice Lowest offer amount for a specific art piece
   */
  function lowestEditionOffer(uint artPieceId, uint edition) public view isAuthorized returns (uint) {
    uint _lowestOffer = 0;
    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].artPieceId == artPieceId && _offers[i].edition == edition && (_lowestOffer == 0 || _offers[i].amount < _lowestOffer)) {
        _lowestOffer = _offers[i].amount;
      }
    }
    return _lowestOffer;
  }

  /**
   * @notice Returns arrays of bid data for a particular address
   */
  function getBids(address bidder) public view isAuthorized returns (uint[], uint[], uint[]) {
    uint bidderBidCount = this.bidCount(bidder);
    uint[] memory pieceIds = new uint[](bidderBidCount);
    uint[] memory editions = new uint[](bidderBidCount);
    uint[] memory bidAmounts = new uint[](bidderBidCount);
    uint bidIndex = 0;

    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].bidder == bidder) {
        pieceIds[bidIndex] = _bids[i].artPieceId;
        editions[bidIndex] = _bids[i].edition;
        bidAmounts[bidIndex] = _bids[i].amount;
        bidIndex++;
      }
    }

    return (pieceIds, editions, bidAmounts);
  }

  /**
   * @notice Returns arrays of offer data for a particular address
   */
  function getOffers(address seller) public view isAuthorized returns (uint[], uint[], uint[]) {
    uint sellerOfferCount = this.offerCount(seller);
    uint[] memory pieceIds = new uint[](sellerOfferCount);
    uint[] memory editions = new uint[](sellerOfferCount);
    uint[] memory offerAmounts = new uint[](sellerOfferCount);
    uint offerIndex = 0;

    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].seller == seller) {
        pieceIds[offerIndex] = _offers[i].artPieceId;
        editions[offerIndex] = _offers[i].edition;
        offerAmounts[offerIndex] = _offers[i].amount;
        offerIndex++;
      }
    }

    return (pieceIds, editions, offerAmounts);
  }

  /**
   * @notice Remove offer on an edition
   */
  function deleteOffer(address seller, uint artPieceId, uint edition) public isAuthorized whenNotPaused {
    _deleteOffer(seller, artPieceId, edition);
  }

  /**
   * @notice Remove bid on an edition
   */
  function deleteBid(address bidder, uint artPieceId, uint edition) public isAuthorized whenNotPaused {
    _deleteBid(bidder, artPieceId, edition);
  }

  /**
   * @dev Owner accessible functions
   */

  /**
   * @dev Returns arrays of data for all bids
   */
  function getAllBids() public view onlyOwner returns (address[], uint[], uint[], uint[]) {
    uint[] memory pieceIds = new uint[](_bids.length);
    uint[] memory editions = new uint[](_bids.length);
    uint[] memory bidAmounts = new uint[](_bids.length);
    address[] memory addresses = new address[](_bids.length);

    for(uint i = 0; i < _bids.length; i++) {
      pieceIds[i] = _bids[i].artPieceId;
      editions[i] = _bids[i].edition;
      bidAmounts[i] = _bids[i].amount;
      addresses[i] = _bids[i].bidder;
    }

    return (addresses, pieceIds, editions, bidAmounts);
  }

  /**
   * @dev Delete any previous stored bids and refund eth to bidder
   */
  function deleteAllBids(address bidder) public onlyOwner {
    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].bidder == bidder) {
        _bids[i].bidder.transfer(_bids[i].amount);
        _deleteBidAtIndex(i);
      }
    }
    if (_bidExistsForAddress(bidder)) {
      deleteAllBids(bidder);
    }
  }

  /**
   * @dev Returns arrays of data for all offers
   */
  function getAllOffers() public view isAuthorized returns (address[], uint[], uint[], uint[]) {
    uint[] memory pieceIds = new uint[](_offers.length);
    uint[] memory editions = new uint[](_offers.length);
    uint[] memory offerAmounts = new uint[](_offers.length);
    address[] memory addresses = new address[](_offers.length);

    for(uint i = 0; i < _offers.length; i++) {
      pieceIds[i] = _offers[i].artPieceId;
      editions[i] = _offers[i].edition;
      offerAmounts[i] = _offers[i].amount;
      addresses[i] = _offers[i].seller;
    }

    return (addresses, pieceIds, editions, offerAmounts);
  }

  /**
   * @dev Delete any previous stored offers
   */
  function deleteAllOffers(address seller) public onlyOwner {
    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].seller == seller) {
        _deleteOfferAtIndex(i);
      }
    }
    if (_offerExistsForAddress(seller)) {
      deleteAllOffers(seller);
    }
  }

  /**
   * @dev Internal functions
   */

  /**
   * @dev Find index of bid matching offer
   * @return uint of found bid index or lengths of bids array if not found
   */
  function _findMatchingBid(uint _artPieceId, uint _edition, uint _amount) internal view returns (uint) {
    uint _lowestTimestamp = MAX_UINT;
    //Set it to more than length of bids since it could never be that
    uint _index = _bids.length + 1;
    // Loop over all bids and look for the first placed matching amount (equal or greater than offer)
    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].amount >= _amount && _bids[i].artPieceId == _artPieceId && _bids[i].edition == _edition && _bids[i].timestamp <= _lowestTimestamp) {
        _index = i;
        _lowestTimestamp = _bids[i].timestamp;
      }
    }
    return _index;
  }

  /**
   * @dev Find index of offer matching bid
   * @return uint of found bid index or lengths of bids array if not found
   */
  function _findMatchingOffer(uint _artPieceId, uint _edition, uint _amount) internal view returns (uint) {
    uint _lowestTimestamp = MAX_UINT;
    //Set it to more than length of bids since it could never be that
    uint _index = _offers.length + 1;
    // Loop over all bids and look for the first placed matching amount (equal or greater than offer)
    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].amount <= _amount && _offers[i].artPieceId == _artPieceId && _offers[i].edition == _edition && _offers[i].timestamp <= _lowestTimestamp) {
        _index = i;
        _lowestTimestamp = _offers[i].timestamp;
      }
    }
    return _index;
  }

  /**
   * @dev Fufill a stored bid by transfering bid amount to seller and transfer token to bidder
   * @return address of bidder address
   */
  function _completeOffer(address _seller, uint _tokenId, uint _bidIndex) internal {
    NFToken artGallery = NFToken(msg.sender);
    // Transfer the piece from seller to bidder.
    address _buyer = _bids[_bidIndex].bidder;
    artGallery.transferFrom(_seller, _buyer, _tokenId);
    // Transfer the payout to the seller
    Bid memory _bid = _bids[_bidIndex];
    uint _payout = (_bid.amount * _payoutPercent)/100;
    _deleteBidAtIndex(_bidIndex);
    _seller.transfer(_payout);
    owner.transfer((_bid.amount * _commissionPercent)/100);
    emit LogOfferMet(_seller, _buyer, _tokenId, _bid.artPieceId, _bid.edition, _bid.amount, _payout);
  }

  function _completeBid(address _buyer, uint _amount, uint _offerIndex) internal {
    NFToken artGallery = NFToken(msg.sender);
    // Transfer the piece from seller to bidder.
    Offer memory _offer = _offers[_offerIndex];
    artGallery.transferFrom(_offer.seller, _buyer, _offer.tokenId);
    _deleteOfferAtIndex(_offerIndex);
    // Transfer the payout to the seller and commission to owner
    uint _payout = (_amount * _payoutPercent)/100;
    _offer.seller.transfer(_payout);
    owner.transfer((_amount * _commissionPercent)/100);
    emit LogBidMet(_offer.seller, _buyer, _offer.tokenId, _offer.artPieceId, _offer.edition, _amount, _payout);
  }

  /**
   * @dev Remove a particular offer for a seller
   */
  function _deleteOffer(address seller, uint artPieceId, uint edition) internal {
    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].seller == seller && _offers[i].artPieceId == artPieceId && _offers[i].edition == edition) {
        _deleteOfferAtIndex(i);
        break;
      }
    }
  }

  /**
   * @dev Remove a particular bid for a bidder
   */
  function _deleteBid(address bidder, uint artPieceId, uint edition) internal {
    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].bidder == bidder && _bids[i].artPieceId == artPieceId && _bids[i].edition == edition) {
        uint amount = _bids[i].amount;
        _deleteBidAtIndex(i);
        // Transfer bid amount back to bidder
        bidder.transfer(amount);
        break;
      }
    }
  }

  /**
   * @dev Deletes an offer at a certain array index
   */
  function _deleteOfferAtIndex(uint index) internal {
    _offers[index] = _offers[_offers.length-1];
    delete _offers[_offers.length-1];
    _offers.length--;
  }

  /**
   * @dev Deletes a bid at a certain array index
   */
  function _deleteBidAtIndex(uint index) internal {
    if(_bids.length > 0 && index < _bids.length) {
      _bids[index] = _bids[_bids.length-1];
      delete _bids[_bids.length-1];
      _bids.length--;
    }
  }

  /**
   * @dev Checks if bids array contains bids for a specific address
   */
  function _bidExistsForAddress(address bidder) internal view returns (bool) {
    for(uint i = 0; i < _bids.length; i++) {
      if(_bids[i].bidder == bidder) {
        return true;
      }
    }
    return false;
  }

  /**
   * @dev Checks if bids array contains bids for a specific address
   */
  function _offerExistsForAddress(address seller) internal view returns (bool) {
    for(uint i = 0; i < _offers.length; i++) {
      if(_offers[i].seller == seller) {
        return true;
      }
    }
    return false;
  }
}
