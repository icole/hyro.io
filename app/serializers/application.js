import DS from 'ember-data'
import { assign } from '@ember/polyfills';

export default DS.RESTSerializer.extend({
  serializeIntoHash: function(hash, type, record, options) {
    assign(hash, this.serialize(record, options));
  }
});