import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

@classic
export default class Transaction extends Model {
  @attr('number')
  amount;

  @attr('number')
  edition;

  @attr('string')
  tx_hash;

  @attr('string')
  tx_type;

  @computed('tx_hash')
  get ethscanLink() {
    return `https://rinkeby.etherscan.io/tx/${this.get('tx_hash')}`;
  }

  @computed('tx_type')
  get typeDisplay() {
    return this.get('tx_type') ? this.get('tx_type').charAt(0).toUpperCase() + this.get('tx_type').slice(1) : '';
  }

  @attr('string')
  createdAt;

  @computed('createdAt')
  get dateDisplay() {
    return new Date(this.get('createdAt')).toLocaleDateString();
  }

  @belongsTo('art-piece')
  artPiece;

  @belongsTo('user')
  user;
}
