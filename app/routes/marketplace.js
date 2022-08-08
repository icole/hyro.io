import classic from 'ember-classic-decorator';
import { observes } from '@ember-decorators/object';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import '@ember/object';

@classic
export default class MarketplaceRoute extends Route {
  @inject('web3')
  web3;

  @observes('web3.contract')
  contractObserver() {
    this.refresh();
  }

  async model() {
    let web3 = this.get('web3');
    let contract = web3.get('contract');
    if (contract) {
      let artPieces = await this.store.findAll('art-piece');
      try {
        let instance = await contract.deployed();
        let highestBid, lowestOffer;
        await Promise.all(artPieces.map(async (piece) => {
          highestBid = await instance.highestBid(parseInt(piece.id));
          piece.set('highestBid', parseFloat(web3.get('web3Instance').fromWei(highestBid, "ether")));
          lowestOffer = await instance.lowestOffer(piece.id);
          piece.set('lowestOffer', parseFloat(web3.get('web3Instance').fromWei(lowestOffer, "ether")));
          return piece;
        }));
      } catch (error) {
        console.error(error);
      }
      return artPieces;
    }
  }
}
