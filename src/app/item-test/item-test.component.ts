import { Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as FontFaceObserver from 'fontfaceobserver';
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

    $(window).resize(function () {
      game.resize($(window).width(), $(window).height());
    });

    this.game.resize($(window).width(), $(window).height());

    function do_update() {
      game.do_update();
      game.draw();
    }

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

    function timeout_func() {
      do_update();
      setTimeout(timeout_func, 1000 / game.fps);
    }

    setTimeout(timeout_func, 1000 / game.fps);

    const font = new FontFaceObserver('Inconsolata');

    font.load().then(function () {
      game.draw();
    });
  }
}
