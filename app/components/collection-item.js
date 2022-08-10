import Component from '@ember/component';
//import Intense from 'intense-images';

export default Component.extend({
  tagName: "",

  actions: {
    openCertificateModal(edition) {
      this.openCertificateModal(edition);
    },
    openMessageModal() {
      const messageModal = document.querySelector('.artist-message-overlay') || null;
      messageModal.classList.add('active');
      messageModal.querySelector('.bg').addEventListener('click', function () {
        messageModal.classList.remove('active');
      });
      messageModal.querySelector('a.close').addEventListener('click', function () {
        messageModal.classList.remove('active');
      });
    },
    openPrintModal() {
      const printModal = document.querySelector('.print-overlay') || null;
      printModal.classList.add('active');
      printModal.querySelector('.bg').addEventListener('click', function () {
        printModal.classList.remove('active');
      });
      printModal.querySelector('a.close').addEventListener('click', function () {
        printModal.classList.remove('active');
      });
    },
    toggleOfferModal(artEdition) {
      this.toggleOfferModal(artEdition)
    },
    enlargePiece(previewImage) {
      this.set("enlargedImage", previewImage);
      const galleryPopup = document.querySelector('.enlarge-overlay');
      galleryPopup.classList.add('active');

      // Close button and also close when you click the overlay
      galleryPopup.querySelector('.bg').addEventListener('click', function () {
        galleryPopup.classList.remove('active');
      });
      galleryPopup.querySelector('div.close').addEventListener('click', function () {
        galleryPopup.classList.remove('active');
      });
    }
  },

  didInsertElement() {
    this._super(...arguments);
    var elements = document.querySelectorAll('.collection-img');
    //Intense(elements)
  }
});
