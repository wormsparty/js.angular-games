import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  onResize(event) {
  }

  onKeydown(event) {
  }

  onKeyup(event) {
  }

  onMouseMove(event) {
  }

  mouseDown(event) {
  }

  mouseUp(event) {
  }
}
