import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class NewController extends Controller {
  fileUploading = false;

  @action
  save() {
    let self = this;
    this.model.save().then(function () {
      self.transitionToRoute('galleries');
    }).catch(function (reason) {
      console.error(reason);
    });
  }

  @action
  uploadImage() {
    //this.set('fileUploading', true);
    //const file = event.target.files[0]
    //const reader = new window.FileReader()
    //reader.readAsArrayBuffer(file)
    //const self = this;
    //reader.onloadend = () => {
    //  const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    //  ipfs.files.add(new buffer.Buffer(reader.result), (error, result) => {
    //    if (error) {
    //      console.error(error)
    //      return
    //    }
    //    self.set('model.image', result[0].hash);
    //    self.set('fileUploading', false);
    //  })
    //}
  }
}
