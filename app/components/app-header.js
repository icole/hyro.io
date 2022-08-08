import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { layout } from '@ember-decorators/component';
import { inject } from '@ember/service';
import Component from '@ember/component';

@classic
@layout(inject('layout'))
export default class AppHeader extends Component {
  @inject('session')
  session;

  @inject('current-user')
  currentUser;

  @inject()
  router;

  @action
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
  }

  @action
  async openMenu() {
    await this.get('currentUser').load();
    let menu = document.querySelector('.menu');
    if (!menu.classList.contains('active')) {
      menu.style.display = "block";
      menu.querySelector('.bg').style.display = "block";
      setTimeout(() => {
        menu.querySelector('.bg').style.opacity = 1;
        menu.classList.add('active');

        let menuItems = [...menu.querySelectorAll('li')];

        for (let i = 0; i < menuItems.length; i++) {
          setTimeout(() => {
            menuItems[i].classList.add('active');
          }, 100 * i);
        }
      }, 200);
    }

    document.querySelector('.menu .bg').addEventListener('click', function () {
      // Close button and also close when you click the overlay
      let menu = document.querySelector('.menu');

      menu.querySelector('.bg').style.opacity = 0;

      let menuItems = [...menu.querySelectorAll('li')];

      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active');
      }

      menu.classList.remove('active');

      menu.querySelector('.bg').style.display = "none";
      menu.style.display = "none";
    });
    document.querySelector('.menu a.close').addEventListener('click', function () {
      let menu = document.querySelector('.menu');

      menu.querySelector('.bg').style.opacity = 0;

      let menuItems = [...menu.querySelectorAll('li')];

      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active');
      }

      menu.classList.remove('active');

      menu.querySelector('.bg').style.display = "none";
      menu.style.display = "none";
    });
  }
}
