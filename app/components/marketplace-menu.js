import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  router: inject(),

  actions: {
    closeMenu() {
      let menu = document.querySelector('.menu');

      menu.querySelector('.bg').style.opacity = 0;

      let menuItems = [...menu.querySelectorAll('li')];

      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active');
      }

      menu.classList.remove('active');

      setTimeout(() => {
        menu.querySelector('.bg').style.display = "none";
        menu.style.display = "none";
      }, 500);
    },
    userLogout() {
      this.get('session').invalidate('authenticator:custom');
      this.actions.closeMenu();
      this.get('router').transitionTo('index');
    },
  }
});
