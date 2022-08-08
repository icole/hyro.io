import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@classic
export default class RarenessOverlay extends Component {
  @action
  openRarenessModal() {
    const rarenessModal = document.querySelector('.rareness-overlay') || null;
    rarenessModal.classList.add('active');
    rarenessModal.querySelector('.bg').addEventListener('click', function(){
      rarenessModal.classList.remove('active');
    });
    rarenessModal.querySelector('a.close').addEventListener('click', function(){
      rarenessModal.classList.remove('active');
    });
  }
}
