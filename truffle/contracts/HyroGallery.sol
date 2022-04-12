pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "./HyroSellable.sol";
import "./Destructible.sol";
import "./Pausable.sol";

/**
 * @title HyroGallery
 * @dev Gallery to store data about Hyro art pieces and their respective owners
 */
contract HyroGallery is HyroSellable, Destructible, Pausable {

  // Metadata around Art Pieces
  struct ArtPiece {
    uint id;
    string artist;
    string description;
    uint baseAmount; // Stored in Wei
    uint editions;
    uint claimed;
    string ipfsHash;
  }

  // Onboarded Art Pieces
  mapping (uint => ArtPiece) internal _availablePieces;

  event LogPieceClaimed(
    address indexed _buyer,
    uint _tokenId,
    uint indexed _artPieceId,
    uint indexed _edition,
    uint _amount
  );

  // Constructor
  constructor() public {}

  /**
   * @dev External functions
   */

  /**
   * @notice Claim a new art piece edition
   */
  function claimPiece(uint _artPieceId, uint _edition) external payable whenNotPaused {
    require(_artPieceId > 0, "Art piece id invalid");
    ArtPiece storage artPiece = _availablePieces[_artPieceId];
    require(artPiece.id != 0, "Retrieved Art piece id invalid");
    require(_edition > 0 && _edition <= artPiece.editions, "Edition invalid");
    require(msg.value >= artPiece.baseAmount, "Payable amount less than art piece amount");

    // Mint new token
    uint tokenId = generateId(_artPieceId, _edition);
    _mint(msg.sender, tokenId);
    artPiece.claimed += 1;
    emit LogPieceClaimed(msg.sender, tokenId, _artPieceId, _edition, msg.value);
  }

  /**
   * @notice Total allowed editions of an art piece
   */
  function totalEditions(uint _artPieceId) external view returns (uint) {
    return _availablePieces[_artPieceId].editions;
  }

  /**
   * @notice Total claimed editions of an art piece
   */
  function totalClaimed(uint _artPieceId) external view returns (uint) {
    return _availablePieces[_artPieceId].claimed;
  }

  /**
   * @notice Owned art editions for an owner address
   */
  function getOwnedEditions(address pieceOwner) external view returns (uint[], uint[], uint[]) {
    uint[] memory tokenIds = ownerToIds[pieceOwner];

    uint[] memory artPieceIds = new uint[](tokenIds.length);
    uint[] memory editions = new uint[](tokenIds.length);

    for (uint i = 0; i < tokenIds.length; i++) {
      uint[] memory pieceAndEdition = idToPieceIds[tokenIds[i]];
      artPieceIds[i] = pieceAndEdition[0];
      editions[i] = pieceAndEdition[1];
    }

    return (artPieceIds, editions, tokenIds);
  }

  /**
   * @dev Owner accessible functions
   */

  /**
   * @dev Adds new art piece data
   */
  function addArtPiece(uint _id, string _artist, string _description, uint _baseAmount, uint _editions, string _ipfsHash) external onlyOwner {
    _availablePieces[_id] = ArtPiece({
      id: _id,
      artist: _artist,
      description: _description,
      baseAmount: _baseAmount,
      editions: _editions,
      claimed: 0,
      ipfsHash: _ipfsHash
    });
  }

  /**
   * @dev Adds new art piece data
   */
  function retrieveArtPiece(uint _id) external onlyOwner returns (ArtPiece) {
    return _availablePieces[_id];
  }

  /**
   * @dev Returns all owned token ids
   */
  function allOwnedTokens() external view onlyOwner returns (uint[]) {
    return tokens;
  }

  /**
   * @dev Cash out claim payments to owner
   */
  function cashOutPayments() external onlyOwner {
    owner.transfer(address(this).balance);
  }

  /**
   * @dev Fallback function
   */
  function () public payable {
    revert("Fallback not allowed");
  }

}
