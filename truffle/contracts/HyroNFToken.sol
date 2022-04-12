pragma solidity 0.4.24;

import "@0xcert/ethereum-erc721/contracts/tokens/NFToken.sol";
import "@0xcert/ethereum-erc721/contracts/tokens/ERC721Enumerable.sol";
import "@0xcert/ethereum-erc721/contracts/tokens/ERC721Metadata.sol";
import "@0xcert/ethereum-utils/contracts/ownership/Ownable.sol";

/**
 * @title ERC721 token with optional Enummerable and Metadata implementations
 * @dev Base implementations from @0xcert
 */

contract HyroNFToken is NFToken, ERC721Enumerable, ERC721Metadata, Ownable {

  /**
   * @dev A descriptive name for a collection of NFTs.
   */
  string private nftName;

  /**
   * @dev An abbreviated name for NFTokens.
   */
  string private nftSymbol;

  /**
   * @dev Mapping from NFToken ID to metadata uri.
   */
  mapping (uint => string) internal idToUri;

  /**
   * @dev Array of all NFToken IDs.
   */
  uint[] internal tokens;

  /**
   * @dev Mapping from owner address to a list of owned NFToken IDs.
   */
  mapping(uint => uint) internal idToIndex;

  /**
   * @dev Mapping from owner to list of owned NFToken IDs.
   */
  mapping(address => uint[]) internal ownerToIds;

  /**
   * @dev Mapping from NFToken ID to its index in the owner tokens list.
   */
  mapping(uint => uint) internal idToOwnerIndex;

  /**
   * @dev Mapping from NFToken ID to Art Piece ID and Edition.
   */
  mapping(uint => uint[]) internal idToPieceIds;

  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFTokens.
   */
  constructor(string _name, string _symbol) NFToken() public {
    nftName = _name;
    nftSymbol = _symbol;
    supportedInterfaces[0x780e9d63] = true; // ERC721Enumerable
    supportedInterfaces[0x5b5e139f] = true; // ERC721Metadata
  }

  /**
   * @dev Returns a descriptive name for a collection of NFTokens.
   */
  function name() external view returns (string _name) {
    _name = nftName;
  }

  /**
   * @notice Returns an abbreviated name for NFTokens.
   */
  function symbol() external view returns (string _symbol)
  {
    _symbol = nftSymbol;
  }

  /**
   * @dev A distinct URI (RFC 3986) for a given NFToken.
   * @param _tokenId Id for which we want uri.
   */
  function tokenURI(uint _tokenId) external view validNFToken(_tokenId) returns (string)
  {
    return idToUri[_tokenId];
  }

  /**
   * @dev Returns the count of all existing NFTokens.
   */
  function totalSupply() external view returns (uint)
  {
    return tokens.length;
  }

  /**
   * @dev Returns NFToken ID by its index.
   */
  function tokenByIndex(uint _index) external view returns (uint)
  {
    require(_index < tokens.length, "Token index invalid");
    return tokens[_index];
  }

  /**
   * @dev returns the n-th NFToken ID from a list of owner's tokens.
   * @param _owner Token owner's address.
   * @param _index Index number representing n-th token in owner's list of tokens.
   */
  function tokenOfOwnerByIndex(address _owner, uint _index) external view returns (uint)
  {
    require(_index < ownerToIds[_owner].length, "Token index invalid");
    return ownerToIds[_owner][_index];
  }

  /**
   * @dev returns the number of token for a given owner address
   * @param _owner Token owner's address
   */
  function tokenCountOfOwner(address _owner) external view returns (uint) {
    return ownerToIds[_owner].length;
  }

  /**
   * @dev returns the token IDs for a given owner address
   * @param _owner Token owner's address
   */
  function tokensOfOwner(address _owner) external view returns (uint[]) {
    return ownerToIds[_owner];
  }

  /**
   * @dev returns the owner address of an NFTToken ID
   * @param _tokenId Id for which we want owner address
   */
  function idToAddress(uint _tokenId) external view returns (address) {
    return idToOwner[_tokenId];
  }

  /**
   * @dev Mints a new NFToken.
   * @notice This is a private function which should be called from user-implemented external
   * minter. Its purpose is to show and properly initialize data structures when using this
   * implementation.
   * @param _to The address that will own the minted NFToken.
   * @param _tokenId of the NFToken to be minted by the msg.sender.
   */
  function _mint(address _to, uint _tokenId) internal
  {
    super._mint(_to, _tokenId);
    tokens.push(_tokenId);
  }

  /**
   * @dev Burns a NFToken.
   * @notice This is a private function which should be called from user-implemented external
   * burner. Its purpose is to show and properly initialize data structures when using this
   * implementation.
   * @param _owner Address of the NFToken owner.
   * @param _tokenId ID of the NFToken to be burned.
   */
  function _burn(address _owner, uint _tokenId) internal
  {
    assert(tokens.length > 0);
    super._burn(_owner, _tokenId);

    uint tokenIndex = idToIndex[_tokenId];
    uint lastTokenIndex = tokens.length.sub(1);
    uint lastToken = tokens[lastTokenIndex];

    tokens[tokenIndex] = lastToken;
    tokens[lastTokenIndex] = 0;

    tokens.length--;
    idToIndex[_tokenId] = 0;
    idToIndex[lastToken] = tokenIndex;
  }

  /**
   * @dev Removes a NFToken from an address.
   * @param _from Address from wich we want to remove the NFToken.
   * @param _tokenId Which NFToken we want to remove.
   */
  function removeNFToken(address _from, uint _tokenId) internal
  {
    super.removeNFToken(_from, _tokenId);
    assert(ownerToIds[_from].length > 0);

    uint tokenToRemoveIndex = idToOwnerIndex[_tokenId];
    uint lastTokenIndex = ownerToIds[_from].length.sub(1);
    uint lastToken = ownerToIds[_from][lastTokenIndex];

    ownerToIds[_from][tokenToRemoveIndex] = lastToken;
    ownerToIds[_from][lastTokenIndex] = 0;

    ownerToIds[_from].length--;
    idToOwnerIndex[_tokenId] = 0;
    idToOwnerIndex[lastToken] = tokenToRemoveIndex;
  }

  /**
   * @dev Assignes a new NFToken to an address.
   * @param _to Address to wich we want to add the NFToken.
   * @param _tokenId Which NFToken we want to add.
   */
  function addNFToken(address _to, uint _tokenId) internal
  {
    super.addNFToken(_to, _tokenId);

    uint length = ownerToIds[_to].length;
    ownerToIds[_to].push(_tokenId);
    idToOwnerIndex[_tokenId] = length;
  }

  /**
   * @dev Creates a unique single ID from art piece ID and edition
   * Uses Cantor pairing function
   * http://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
   * @param _artPieceId ID for Art Piece
   * @param _edition Edition number of Art Piece
   */
  function generateId(uint _artPieceId, uint _edition) public returns (uint) {
    uint tokenId = uint(((_artPieceId + _edition) * (_artPieceId + _edition + uint(1))) / uint(2)) + _edition;
    idToPieceIds[tokenId] = [_artPieceId, _edition];
    return tokenId;
  }
}
