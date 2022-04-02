import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  currentUser: inject('current-user'),
  store: inject('store'),
  displayPiece: null,
  isDisplayPiece: computed('displayPiece', 'edition', function () {
    return true;
  }),

  actions: {
    async updateDisplay(artPiece) {
      await this.get('currentUser').load();
      let self = this;
      let account = this.get('currentUser').user.id;
      let displayPiece = await this.get('store').findRecord('display-piece', account).catch(function() {
        return self.get('store').createRecord('display-piece', {
          artPiece: '',
          owner: account
        });
      });
      displayPiece.set('artPiece', artPiece);
      displayPiece.save();
    },
    async toggleDescription(displayPiece) {
      displayPiece.set('showDescription', !displayPiece.get('showDescription'));
      displayPiece.save();
    }
  }
});
