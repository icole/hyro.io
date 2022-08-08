import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class BidsController extends Controller {
  @inject('web3')
  web3;

  enlargedImagePath = null;

  @action
  toggleBidModal(bid) {
    this.set('bidEdition', bid);
    this.toggleProperty('isShowingBidModal');
  }

  @action
  async deleteBid(bid) {
    let web3 = this.web3;
    let contract = web3.get('contract');
    let account = web3.get('account');
    if (contract && account) {
      try {
        let instance = await contract.deployed();
        await instance.deleteBid(bid.get('artPiece.id'), bid.get('edition'), {
          from: account,
          gas: 500000,
        });
        bid.deleteRecord();
      } catch (error) {
        console.error(error);
      }
    }
  }
}
