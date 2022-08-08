import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class ApplicationController extends Controller {
  @computed('currentPath')
  get disableHeader() {
    return this.currentPath === 'gallery-display.display';
  }

  @computed('currentPath')
  get disableFooter() {
    return this.currentPath === 'gallery-display.display';
  }
}
