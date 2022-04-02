import Component from '@ember/component';

export default Component.extend({

  actions: {
    toggleBidModal(edition) {
      this.set('bidEdition', edition);
      this.toggleProperty('isShowingBidModal');
    }
  }
});
