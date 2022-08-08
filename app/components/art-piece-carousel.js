import { tagName } from "@ember-decorators/component";
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@tagName("")
@classic
export default class ArtPieceCarousel extends Component {
  carousel = null;
  leftScroll = null;
  rightScroll = null;

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.set('carousel', {});
    this.set('carousel.e', document.getElementById('gallery-carousel'));
    this.set('carousel.items', document.getElementById('carousel-items'));
    this.set('leftScroll', document.getElementById('left-scroll-carousel-button'));
    this.set('rightScroll', document.getElementById('right-scroll-carousel-button'));

    this.setScrollOpacity();
  }

  MouseWheelHandler(e, element) {
    var delta = 0;
    if (typeof e === 'number') {
      delta = e;
    } else {
      if (e.deltaX !== 0) {
        delta = e.deltaX;
      } else {
        delta = e.deltaY;
      }
      e.preventDefault();
    }

    element.scrollLeft -= (delta);
    this.setScrollOpacity();
  }

  setLeftScrollOpacity() {
    if (this.isScrolledAllLeft()) {
      this.set('leftScroll.style.opacity', 0);
    } else {
      this.set('leftScroll.style.opacity', 1);
    }
  }

  isScrolledAllLeft() {
    return this.get('carousel.items.scrollLeft') === 0;
  }

  isScrolledAllRight() {
    const items = this.get('carousel.items');
    if (items.scrollWidth > items.offsetWidth) {
      if (items.scrollLeft + items.offsetWidth === items.scrollWidth) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  setRightScrollOpacity() {
    if (this.isScrolledAllRight()) {
      this.set('rightScroll.style.opacity', 0);
    } else {
      this.set('rightScroll.style.opacity', 1);
    }
  }

  setScrollOpacity() {
    this.setLeftScrollOpacity();
    this.setRightScrollOpacity();
  }

  @action
  leftScrollClick() {
    this.MouseWheelHandler(100, this.get('carousel.items'));
  }

  @action
  rightScrollClick() {
    this.MouseWheelHandler(-100, this.get('carousel.items'));
  }

  @action
  updateSelectedPiece(pieceId) {
    //this.get('updateSelectedPiece')(pieceId);
  }
}
