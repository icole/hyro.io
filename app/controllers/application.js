import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class ApplicationController extends Controller {
  @computed('currentPath')
  get disableHeader() {
    this.get('currentPath') == 'gallery-display.display';
  }

  @computed('currentPath')
  get disableFooter() {
    this.get('currentPath') == 'gallery-display.display';
  }
}
