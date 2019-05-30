import { Component, OnInit} from '@angular/core';
import {Game} from './game';

@Component({
  selector: 'app-item-test',
  templateUrl: './item-test.component.html',
  styleUrls: ['./item-test.component.css'],
})
export class ItemTestComponent implements OnInit {
  private game: Game;

  ngOnInit() {
    document.body.style.overflow = 'hidden';

    const game = new Game();
    this.game = game;
    this.game.resize(window.innerWidth, window.innerHeight);
    game.loop();
  }

  onResize(event) {
    this.game.resize(event.target.innerWidth, event.target.innerHeight);
  }

  onKeydown(event) {
    if (this.game.pressed.has(event.key)) {
      this.game.pressed.set(event.key, true);
    }
  }

  onKeyup(event) {
    if (this.game.pressed.has(event.key)) {
      this.game.pressed.set(event.key, false);
    }
  }

  onMouseMove(event) {
    this.game.engine.setMousePos(event.pageX, event.pageY);
  }
}
