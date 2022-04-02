import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  web3: inject('web3'),
  certificateEdition: null,
  isShowingOfferModal: false,
  pieceOffered: null,

  actions: {
    openCertificateModal(edition) {
      this.set('certificateEdition', edition);
      const certificateModal = document.querySelector('.certificate-overlay') || null;
      certificateModal.classList.add('active');
      certificateModal.querySelector('.bg').addEventListener('click', function () {
        certificateModal.classList.remove('active');
      });
      certificateModal.querySelector('a.close').addEventListener('click', function () {
        certificateModal.classList.remove('active');
      });
    },
    toggleOfferModal(artEdition) {
      this.set('editionOffered', artEdition);
      // Close the art piece data in case the edition gets sold and removed
      this.set('pieceOffered', artEdition.get('artPiece'));
      this.toggleProperty('isShowingOfferModal');
    }
  }
});
