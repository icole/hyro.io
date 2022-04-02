import Component from '@ember/component';

export default Component.extend({
  actions: {
    faqOpen() {
      event.currentTarget.classList.toggle('active')
      const faq = [...document.querySelectorAll('.faq')] || null;
      for(let i = 0; i < faq.length; i++){
        if (event.currentTarget !== faq[i]) {
          faq[i].classList.remove('active');
        }
      }
    }
  }
});
