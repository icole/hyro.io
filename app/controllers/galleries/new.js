import Controller from '@ember/controller';
import buffer from 'buffer';
import IPFS from 'ipfs-api';

export default Controller.extend({
  fileUploading: false,

  actions: {
    save() {
      let self = this;
      this.get('model').save().then(function() {
        self.transitionToRoute('galleries');
      }).catch(function(reason) {
        console.error(reason);
      });
    },
    uploadImage(event) {
      this.set('fileUploading', true);
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      const self = this;
      reader.onloadend = () => {
        const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
        ipfs.files.add(new buffer.Buffer(reader.result), (error, result) => {
          if(error) {
            console.error(error)
            return
          }
          self.set('model.image', result[0].hash);
          self.set('fileUploading', false);
        })
      }
    }
  }
});
