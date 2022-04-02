  import Component from '@ember/component';
  import { inject } from '@ember/service';

  export default Component.extend({
    web3: inject('web3'),
    session: inject('session'),
    currentUser: inject('current-user'),
    spinner: inject('spinner'),
    router: inject('router'),
    orderProcessing: false,

    actions: {
      openArtistOverlay() {
        const artistOverlay = document.querySelector('.artist-overlay') || null;
        //let tmp = artistInfoButtons[i].closest('.item').dataset.artist;
        artistOverlay.querySelector('p.info').textContent = "This artist has chosen to remain anonymous.";
        artistOverlay.querySelector('p.big').textContent = "About the artist";
        artistOverlay.querySelector('div.more-info').innerHTML = '';
        artistOverlay.classList.add('active');
        artistOverlay.querySelector('div.close').addEventListener('click', function () {
          artistOverlay.classList.remove('active');
        });
      },
      openInfoModal() {
        const infoModal = document.querySelector('.info-overlay') || null;
        infoModal.classList.add('active');
        infoModal.querySelector('.bg').addEventListener('click', function () {
          infoModal.classList.remove('active');
        });
        infoModal.querySelector('a.close').addEventListener('click', function () {
          infoModal.classList.remove('active');
        });
      },
      async buyCurrentRelease() {
        let web3 = this.get('web3');
        let contract = web3.get('contract');
        let account = web3.get('account');
        let artPieceId = this.get('art-piece.id');
        let editionId = this.get('art-piece.nextEdition');
        await this.get('currentUser').load();

        if (contract && account) {
          this.set('orderProcessing', true);
          this.get('spinner').show('order-processing');

          try {
            let galleryInstance = await contract.deployed();
            let latestWatched = await web3.get('web3Instance').eth.getBlockNumber(console.log);
            let claimEvent = galleryInstance.LogPieceClaimed({}, {
              fromBlock: latestWatched,
              toBlock: 'latest'
            });
            let self = this;
            claimEvent.watch(async function (error, result) {
              if (self.get('claimResult') && self.get('claimResult.tx') == result.transactionHash) {
                self.get('spinner').hide('order-processing');
                self.set('claimResult', null);
                self.get('router').transitionTo('order-pending', {
                  queryParams: {
                    tx: result.transactionHash
                  }
                });
              }
            });
            let claimResult = await galleryInstance.claimPiece(artPieceId, editionId, {
              from: account,
              value: web3.get('web3Instance').toWei(0.15, "ether"),
              gas: 500000
            });
            this.set('claimResult', claimResult);
          } catch (err) {
            console.error(err);
            this.get('spinner').hide('order-processing');
          }
        } else {
          this.get('router').transitionTo('sign-in');
        }
      },
      redirectSignIn() {
        this.get('router').transitionTo('sign-in');
      }
    }
  });