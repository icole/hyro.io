import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  // Define your engine's route map here
  this.route('home', { path: '/' });
  this.route('display');
  this.route('collection');
});
