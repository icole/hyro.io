import Route from '@ember/routing/route';

export default Route.extend({
    galleryPieces: null,

    async model(params) {
      let galleryPieces = await this.store.query('art-piece', {
        galleryId: params.gallery_id
      });
      this.controllerFor('galleries.show').set('selectedPiece', galleryPieces.get('firstObject'));
      let gallery = await this.store.findRecord('gallery', params.gallery_id);
      gallery.set('galleryPieces', galleryPieces);
      return gallery;
    } 
});
