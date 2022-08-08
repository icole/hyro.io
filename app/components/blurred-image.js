import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class BlurredImage extends Component {
  mouseMove(event) {
    event.preventDefault();
    let container = document.querySelector(".blur").getBoundingClientRect();
    var upX = event.clientX;
    var upY = event.clientY;
    var mask = document.querySelector('#mask1 circle');
    mask.setAttribute("cy", (upY - container.top) + 'px');
    mask.setAttribute("cx", (upX - container.left) + 'px');
  }
}
