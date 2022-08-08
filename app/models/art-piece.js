import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import DS from 'ember-data';
const { Model, attr, hasMany, belongsTo } = DS;

@classic
export default class ArtPiece extends Model {
  @inject('asset-map')
  assetMap;

  @attr('string')
  artist;

  @attr('string')
  name;

  @attr('string')
  description;

  @attr('string')
  image;

  @attr('string')
  ipfsHash;

  @attr('number')
  editions;

  @attr('number')
  claimed;

  @computed('claimed')
  get nextEdition() {
    if (this.get('claimed') === this.get('editions')) {
      return this.get('claimed');
    } else {
      return this.get('claimed') + 1;
    }
  }

  @computed('claimed')
  get status() {
    if (this.get('soldOut')) {
      return 'SOLD OUT';
    } else {
      return 'Available';
    }
  }

  @computed('claimed')
  get soldOut() {
    return this.get('claimed') === this.get('editions');
  }

  @attr('number')
  highestBid;

  @attr('number')
  lowestOffer;

  @hasMany('art-edition')
  artEditions;

  @belongsTo('gallery')
  gallery;

  @computed('ipfsHash')
  get fullImage() {
    return `https://ipfs.io/ipfs/${this.get('ipfsHash')}`;
  }

  @computed('image')
  get previewImage() {
    return this.get('image') + '_preview';
  }

  @computed('image')
  get previewImagePath() {
    return this.get('image') ? this.get('assetMap').resolve(`assets/images/${this.get('image')}_preview.png`) : '';
  }

  @computed('image')
  get blurredImage() {
    return this.get('image') + '_blurred';
  }
}
