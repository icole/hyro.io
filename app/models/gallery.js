import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, hasMany } from '@ember-data/model';

@classic
export default class Gallery extends Model {
  @attr('string') name;
  @attr('string') location;
  @attr('string') description;
  @attr('string') image;
  @computed('image')
  get imageUrl() {
    return `https://ipfs.io/ipfs/${this.image}`;
  }
  @hasMany('art-piece') galleryPieces;
}
