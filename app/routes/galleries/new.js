import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Route from '@ember/routing/route';

@classic
export default class NewRoute extends Route {
    model() {
        return this.store.createRecord('gallery');
    }

    @action
    willTransition() {
        undefined;
        const gallery = this.controller.get('model');
        gallery.rollbackAttributes();
    }
}
