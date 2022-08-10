import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

@classic
export default class ArtPiece extends Model {
  @inject('asset-map') assetMap;
  @attr('string') artist;
  @attr('string') name;
  @attr('string') description;
  @attr('string') image;
  @attr('string') ipfsHash;
  @attr('number') editions;
  @attr('number') claimed;

  @computed('claimed', 'editions')
  get nextEdition() {
    if (this.claimed === this.editions) {
      return this.claimed;
    } else {
      return this.claimed + 1;
    }
  }

  @computed('claimed', 'soldOut')
  get status() {
    if (this.soldOut) {
      return 'SOLD OUT';
    } else {
      return 'Available';
    }
  }

  @computed('claimed', 'editions')
  get soldOut() {
    return this.claimed === this.editions;
  }

  @attr('number') highestBid;
  @attr('number') lowestOffer;
  @hasMany('art-edition') artEditions;
  @belongsTo('gallery') gallery;

  @computed('ipfsHash')
  get fullImage() {
    return `https://ipfs.io/ipfs/${this.ipfsHash}`;
  }

  @computed('image')
  get previewImage() {
    return this.image + '_preview';
  }

  @computed('image')
  get previewImagePath() {
    return this.image ? this.assetMap.resolve(`assets/images/${this.image}_preview.png`) : '';
  }

  @computed('image')
  get blurredImage() {
    return this.image + '_blurred';
  }
}
