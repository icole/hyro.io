import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class AppAnimated extends Component {
  didRender() {
    super.didRender(...arguments);
    // Animate elements
    const elementsToAnimate = [...document.querySelectorAll('.animated')];

    let screen = window.scrollY + window.innerHeight / 2;

    for (let i = 0; i < elementsToAnimate.length; i++) {
      let yPos = elementsToAnimate[i].getBoundingClientRect().top + window.pageYOffset;

      if (yPos - screen < 275) {
        elementsToAnimate[i].classList.remove('animated');
        elementsToAnimate[i].style.transition = '.8s linear';
        elementsToAnimate[i].style.transform = 'translateY(0%)';
      }
    }

    document.addEventListener('scroll', function () {
      let screen = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < elementsToAnimate.length; i++) {
        let yPos = elementsToAnimate[i].getBoundingClientRect().top + window.pageYOffset;

        if (yPos - screen < 275) {
          elementsToAnimate[i].classList.remove('animated');
          elementsToAnimate[i].style.transition = '.8s linear';
          elementsToAnimate[i].style.transform = 'translateY(0%)';
        }
      }
    });
  }
}
