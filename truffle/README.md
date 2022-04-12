# Hyro Contracts Overview
## HyroGallery
Main contract which will be used by the end user. Inherits functions defined in HyroSellable. 
### Owner Only functions
- `addArtPiece` - Makes a new art piece accessible to be sold by storing metadata about it inside the contract
- `cashOutPayments` - Transfers any funds sent to contract as payments for art pieces back to the owner
### External User functions
- `claimPiece` - Main function used to claimed an available edition of an onboarded art piece
- `totalEditions` - Utility function to return total editions for a piece
- `getOwnedEditions` - Utility function to return art piece ids, editions, and tokenIds for a particular wallet address
## HyroSellable
Wrapper contract that inherits the main ERC721 Non-Fungible Token contract HyroNFToken. It stores the address to HyroMarketplace and implements functions for each HyroMarketplace function so they can be called directly on HyroGallery instead of HyroMarketplace. The motivation behind this was to allow HyroMarketplace to be redeployed and the address be changed inside this contract without affecting the end user.
## HyroNFToken
Inherits basic ERC721 Token from 0xcert (NFToken). Also inherits interfaces ERC721Enumerable and ERC721Metadata and implements support for those additional functions.
## HyroMarketplace
Meant to be a stand-alone contract for all buying/selling functionality between owners of edition tokens. Allows users to places bids on known art pieces and owners to create offers for any of their owned towns.

## Contract Libraries
0xcert implementation of ERC721 https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
https://github.com/0xcert/ethereum-erc721
- `0xcert/NFToken` - Basic ERC721 Non-fungible token implementation
- `0xcert/ERC721Enumerable` - Interface defining optional enumerable functions of NFTokens
- `0xcert/ERC721Metadata` - Interface defining storing of metadata associated with NFTokens
