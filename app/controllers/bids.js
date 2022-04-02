import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  web3: inject('web3'),
  spinner: inject('spinner'),
  enlargedImagePath: null,

  actions: {
    toggleBidModal(bid) {
      this.set('bidEdition', bid);
      this.toggleProperty('isShowingBidModal');
    },
    async deleteBid(bid) {
      let web3 = this.get('web3');
      let contract = web3.get('contract');
      let account = web3.get('account');
      if (contract && account) {
        this.get('spinner').show('processing');
        try {
          let instance = await contract.deployed();
          await instance.deleteBid(bid.get('artPiece.id'), bid.get('edition'), {
            from: account,
            gas: 500000
          });
          bid.deleteRecord();
        } catch (error) {
          console.error(error);
        }
        this.get('spinner').hide('processing');
      }
    }
  }
})
