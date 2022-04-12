pragma solidity 0.4.24;

import "./HyroMarketplace.sol";
import "./HyroNFToken.sol";

/**
 * @dev Proxy contract between HyroGallery and HyroMarketplace
 */
contract HyroSellable is HyroNFToken("Hyro Art Gallery", "HYROART") {
  //Marketplace contract address
  HyroMarketplace _marketplace;
  address _marketplaceAddress;

  // Constructor
  constructor() public {}

  function setMarketplace(address marketplaceAddress) public onlyOwner {
    _marketplace = HyroMarketplace(marketplaceAddress);
    _marketplaceAddress = marketplaceAddress;
  }

  function getMarketplace() public view onlyOwner returns (address) {
    return _marketplaceAddress;
  }

  function placeBid(uint _artPieceId, uint _edition) public payable {
    // Regenerate the tokenId from the artPiecId and edition
    uint _tokenId = generateId(_artPieceId, _edition);
    // Verify the sender does not already own the token
    require(idToOwner[_tokenId] != msg.sender, "Sender is the owner of the token");
    return _marketplace.placeBid.value(msg.value)(msg.sender, _artPieceId, _edition);
  }

  function placeOffer(uint _amount, uint _artPieceId, uint _edition) public payable {
    // Regenerate the tokenId from the artPiecId and edition
    uint _tokenId = generateId(_artPieceId, _edition);
    // Verify the sender actually owns that particular token
    require(idToOwner[_tokenId] == msg.sender, "Sender is not the owner of the token");
    // Allow the marketplace contract to transfer on the owners behalf
    ownerToOperators[msg.sender][_marketplaceAddress] = true;
    return _marketplace.placeOffer(msg.sender, _amount, _tokenId, _artPieceId, _edition);
  }

  function bidCount() public view returns (uint) {
    return _marketplace.bidCount(msg.sender);
  }

  function offerCount() public view returns (uint) {
    return _marketplace.offerCount(msg.sender);
  }

  function highestBid(uint artPieceId) public view returns (uint) {
    return _marketplace.highestBid(artPieceId);
  }

  function highestEditionBid(uint artPieceId, uint edition) public view returns (uint) {
    return _marketplace.highestEditionBid(artPieceId, edition);
  }

  function lowestOffer(uint artPieceId) public view returns (uint) {
    return _marketplace.lowestOffer(artPieceId);
  }

  function lowestEditionOffer(uint artPieceId, uint edition) public view returns (uint) {
    return _marketplace.lowestEditionOffer(artPieceId, edition);
  }

  function getBids() public view returns (uint[], uint[], uint[]) {
    return _marketplace.getBids(msg.sender);
  }

  function getOffers() public view returns (uint[], uint[], uint[]) {
    return _marketplace.getOffers(msg.sender);
  }

  function deleteOffer(uint _artPieceId, uint _edition) public {
    return _marketplace.deleteOffer(msg.sender, _artPieceId, _edition);
  }

  function deleteBid(uint _artPieceId, uint _edition) public {
    return _marketplace.deleteBid(msg.sender, _artPieceId, _edition);
  }
}
