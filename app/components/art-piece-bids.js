import { tagName } from "@ember-decorators/component";
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@tagName("")
@classic
export default class ArtPieceBids extends Component {
  @action
  toggleBidModal(edition) {
    this.set('bidEdition', edition);
    this.toggleProperty('isShowingBidModal');
  }
}
