import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, hasMany, belongsTo } = DS;
import { inject } from '@ember/service';

export default Model.extend({
  assetMap: inject('asset-map'),

  artist: attr('string'),
  name: attr('string'),
  description: attr('string'),
  image: attr('string'),
  ipfsHash: attr('string'),
  editions: attr('number'),
  claimed: attr('number'),
  nextEdition: computed('claimed', function() {
    if (this.get('claimed') === this.get('editions')) {
      return this.get('claimed');
    } else {
      return this.get('claimed') + 1;
    }
  }),
  status: computed('claimed', function() {
    if (this.get('soldOut')) {
      return 'SOLD OUT';
    } else {
      return 'Available';
    }
  }),
  soldOut: computed('claimed', function() {
    return this.get('claimed') === this.get('editions');
  }),
  highestBid: attr('number'),
  lowestOffer: attr('number'),
  artEditions: hasMany('art-edition'),
  gallery: belongsTo('gallery'),
  fullImage: computed('ipfsHash', function() {
    return `https://ipfs.io/ipfs/${this.get('ipfsHash')}`;
  }),
  previewImage: computed('image', function() {
    return this.get('image') + '_preview';
  }),
  previewImagePath: computed('image', function() {
    return this.get('image') ? this.get('assetMap').resolve(`assets/images/${this.get('image')}_preview.png`) : '';
  }),
  blurredImage: computed('image', function() {
    return this.get('image') + '_blurred';
  }),
});
