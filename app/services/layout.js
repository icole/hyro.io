import classic from 'ember-classic-decorator';
import Service from '@ember/service';

@classic
export default class LayoutService extends Service {
  menuName = 'marketplace-menu';

  setMenu(name) {
    this.set('menuName', name);
  }
}
