import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class Transaction extends Model {
  @attr('number') amount;
  @attr('number') edition;
  @attr('string') tx_hash;
  @attr('string') tx_type;
  @attr('string') createdAt;

  @computed('tx_hash')
  get ethscanLink() {
    return `https://rinkeby.etherscan.io/tx/${this.tx_hash}`;
  }

  @computed('tx_type')
  get typeDisplay() {
    return this.tx_type ? this.tx_type.charAt(0).toUpperCase() + this.tx_type.slice(1) : '';
  }

  @computed('createdAt')
  get dateDisplay() {
    return new Date(this.createdAt).toLocaleDateString();
  }

  @belongsTo('art-piece') artPiece;
  @belongsTo('user') user;
}
