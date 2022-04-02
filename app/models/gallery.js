import DS from 'ember-data';
import { computed } from '@ember/object';
const { attr, hasMany } = DS;

export default DS.Model.extend({
  name: attr('string'),
  location: attr('string'),
  description: attr('string'),
  image: attr('string'),
  imageUrl: computed('image', function() {
    return `https://ipfs.io/ipfs/${this.get('image')}`;
  }),
  galleryPieces: hasMany('art-piece')
});
