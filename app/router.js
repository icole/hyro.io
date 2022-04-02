import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import RouterScroll from 'ember-router-scroll';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('my-collection');
  this.route('sign-in');
  this.route('featured-piece');
  this.route('marketplace');
  this.route('order-pending');
  this.route('bids');
  this.route('offers');
  this.route('transactions');
  this.route('art-pieces', function() {
    this.route('show', { path: '/:piece_id' });
  });
  this.route('galleries', function() {
    this.route('show', { path: '/:gallery_id' });
    this.route('new');
  });
  this.mount('gallery-display');
});

export default Router;
