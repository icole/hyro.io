import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  disableHeader: computed('currentPath', function () {
    this.get('currentPath') == 'gallery-display.display';
  }),

  disableFooter: computed('currentPath', function () {
    this.get('currentPath') == 'gallery-display.display';
  }),
});
