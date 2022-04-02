import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { observer } from '@ember/object';

export default Route.extend({
  web3: inject('web3'),

  contractObserver: observer('web3.contract', function() {
    this.refresh();
  }),

  accountObserver: observer('web3.account', function() {
    this.refresh();
  }),

  async model() {
    let web3 = this.get('web3');
    let contract = web3.get('contract');
    let account = web3.get('account');
    if (contract && account) {
      try{
        let instance = await contract.deployed();
        let data = await instance.getBids({from: account});
        let artPieceIds = data.valueOf()[0];
        let editions = data.valueOf()[1];
        let amounts = data.valueOf()[2];
        let edition, piece, pieceId, highestBid, lowestOffer;
        this.get('store').peekAll('bid').invoke('destroyRecord');
        for(let i = 0; i < artPieceIds.length; i++) {
          pieceId = parseInt(artPieceIds[i]);
          edition = parseInt(editions[i]);
          piece = await this.store.find('art-piece', pieceId);
          highestBid = await instance.highestEditionBid(pieceId, edition);
          lowestOffer = await instance.lowestEditionOffer(pieceId, edition);
          this.store.createRecord('bid', {
            bidAmount: web3.get('web3Instance').fromWei(parseInt(amounts[i]), "ether"),
            edition: parseInt(editions[i]),
            highestBid: web3.get('web3Instance').fromWei(highestBid, "ether"),
            lowestOffer: web3.get('web3Instance').fromWei(lowestOffer, "ether"),
            artPiece: piece
          });
        }
        return this.store.peekAll('bid');
      } catch (error) {
        console.error(error);
      }
    }
  }
});
