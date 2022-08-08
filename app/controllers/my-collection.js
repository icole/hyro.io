import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class MyCollectionController extends Controller {
  @inject('web3')
  web3;

  certificateEdition = null;
  isShowingOfferModal = false;
  pieceOffered = null;

  @action
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
  }

  @action
  toggleOfferModal(artEdition) {
    this.set('editionOffered', artEdition);
    // Close the art piece data in case the edition gets sold and removed
    this.set('pieceOffered', artEdition.get('artPiece'));
    this.toggleProperty('isShowingOfferModal');
  }
}
