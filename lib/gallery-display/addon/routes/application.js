import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  layout: inject('layout'),

  beforeModel() {
    this.get('layout').setMenu('display-menu');
  }
});
