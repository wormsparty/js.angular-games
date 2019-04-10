import { Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
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

    $(window).on('resize', () => {
      game.resize($(window).width(), $(window).height());
    });

    this.game.resize($(window).width(), $(window).height());

    $(document).on('keydown', function (event) {
      if (game.pressed.has(event.key)) {
        game.pressed.set(event.key, true);
      }
    });

    $(document).on('keyup', function (event) {
      if (game.pressed.has(event.key)) {
        game.pressed.set(event.key, false);
      }
    });

    game.loop();
  }
}
