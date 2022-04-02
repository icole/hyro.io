import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  session: inject('session'),
  layout: inject('layout'),
  router: inject(),

  actions: {
    closeMenu() {
      let menu = document.querySelector('.menu');

      menu.querySelector('.bg').style.opacity = 0;

      let menuItems = [...menu.querySelectorAll('li')];

      for(let i = 0; i < menuItems.length; i++){
        menuItems[i].classList.remove('active');
      }

      menu.classList.remove('active');

      setTimeout(() => {
        menu.querySelector('.bg').style.display = "none";
        menu.style.display = "none";
      }, 500);
    },
    openMenu() {
      let menu = document.querySelector('.menu');
      if(!menu.classList.contains('active')){
        menu.style.display = "block";
        menu.querySelector('.bg').style.display = "block";
        setTimeout(() => {
          menu.querySelector('.bg').style.opacity = 1;
          menu.classList.add('active');

          let menuItems = [...menu.querySelectorAll('li')];

          for(let i = 0; i < menuItems.length; i++){
            setTimeout(() => {
              menuItems[i].classList.add('active');
            }, 100 * i);
          }
        }, 200);
      }

      document.querySelector('.menu .bg').addEventListener('click', function(){
        // Close button and also close when you click the overlay
        let menu = document.querySelector('.menu');

        menu.querySelector('.bg').style.opacity = 0;

        let menuItems = [...menu.querySelectorAll('li')];

        for(let i = 0; i < menuItems.length; i++){
          menuItems[i].classList.remove('active');
        }

        menu.classList.remove('active');

        menu.querySelector('.bg').style.display = "none";
        menu.style.display = "none";
      });
      document.querySelector('.menu a.close').addEventListener('click', function(){
        let menu = document.querySelector('.menu');

        menu.querySelector('.bg').style.opacity = 0;

        let menuItems = [...menu.querySelectorAll('li')];

        for(let i = 0; i < menuItems.length; i++){
          menuItems[i].classList.remove('active');
        }

        menu.classList.remove('active');

        menu.querySelector('.bg').style.display = "none";
        menu.style.display = "none";
      });
    }
  }
});
