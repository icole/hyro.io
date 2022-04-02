import DS from 'ember-data'
import ENV from '../config/environment';
import { dasherize } from '@ember/string';
import { pluralize } from 'ember-inflector';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';

export default DS.RESTAdapter.extend(TokenAuthorizerMixin, {
  host: ENV.APP.apiHost,

  pathForType: function(type) {
    var dasherized = dasherize(type);
    return pluralize(dasherized);
  }
});
