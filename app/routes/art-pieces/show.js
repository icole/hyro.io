import classic from 'ember-classic-decorator';
import { observes } from '@ember-decorators/object';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import '@ember/object';

@classic
export default class ShowRoute extends Route {
  @inject('current-user')
  currentUser;

  @inject('web3')
  web3;

  @observes('web3.contract')
  contractObserver() {
    this.refresh();
  }

  async model(params) {
    let web3 = this.get('web3');
    let contract = web3.get('contract');
    if (contract) {
      try {
        let instance = await contract.deployed();
        await this.get('currentUser').load();
        let artPiece = await this.store.findRecord('art-piece', params.piece_id);
        let highestBid = await instance.highestBid(parseInt(artPiece.id));
        artPiece.set('highestBid', parseFloat(web3.get('web3Instance').fromWei(highestBid, "ether")));
        let lowestOffer = await instance.lowestOffer(artPiece.id);
        artPiece.set('lowestOffer', parseFloat(web3.get('web3Instance').fromWei(lowestOffer, "ether")));
        // @TODO Figure out why ember is not updating the models
        this.get('store').peekAll('art-edition').invoke('unloadRecord');
        let artEditions = await this.store.query('art-edition', {
          artPieceId: params.piece_id,
          user: this.get('currentUser').user.id
        });
        artPiece.set('artEditions', artEditions);
        return artPiece;
      } catch (error) {
        console.error(error);
      }
    }
  }
}
