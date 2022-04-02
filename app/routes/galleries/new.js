import Route from '@ember/routing/route';

export default Route.extend({

    model() {
        return this.store.createRecord('gallery');
    },

    actions: {
        willTransition() {
            this._super(...arguments);
            const gallery = this.controller.get('model');
            gallery.rollbackAttributes();
        }
    }
});
