import { tagName } from "@ember-decorators/component";
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@tagName("")
@classic
export default class MetamaskFaq extends Component {
  @action
  faqOpen() {
    event.currentTarget.classList.toggle('active')
    const faq = [...document.querySelectorAll('.faq')] || null;
    for(let i = 0; i < faq.length; i++){
      if (event.currentTarget !== faq[i]) {
        faq[i].classList.remove('active');
      }
    }
  }
}
