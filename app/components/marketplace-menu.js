import { tagName } from "@ember-decorators/component";
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Component from '@ember/component';

@tagName("")
@classic
export default class MarketplaceMenu extends Component {
  @inject() session;
  @inject() router;

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
  userLogout() {
    this.session.invalidate('authenticator:custom');
    this.actions.closeMenu();
    this.router.transitionTo('index');
  }
}
