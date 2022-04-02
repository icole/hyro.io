import Service from '@ember/service';

export default Service.extend({
  menuName: 'marketplace-menu',

  setMenu(name) {
    this.set('menuName', name);
  }
});
