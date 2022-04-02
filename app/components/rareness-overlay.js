import Component from '@ember/component';

export default Component.extend({
  actions: {
    openRarenessModal() {
      const rarenessModal = document.querySelector('.rareness-overlay') || null;
      rarenessModal.classList.add('active');
      rarenessModal.querySelector('.bg').addEventListener('click', function(){
        rarenessModal.classList.remove('active');
      });
      rarenessModal.querySelector('a.close').addEventListener('click', function(){
        rarenessModal.classList.remove('active');
      });
    }
  }
});
