import { Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import { Labyrinth } from './labyrinth';
import * as FontFaceObserver from 'fontfaceobserver';

@Component({
  selector: 'app-text-adventure',
  templateUrl: './text-adventure.component.html',
  styleUrls: ['./text-adventure.component.css'],
})
export class TextAdventureComponent implements OnInit {
  private labyrinth: Labyrinth;

  ngOnInit() {
    document.body.style.overflow = 'hidden';

    const labyrinth = new Labyrinth();
    this.labyrinth = labyrinth;

    $(window).resize(function () {
      labyrinth.resize($(window).width(), $(window).height());
    });

    this.labyrinth.resize($(window).width(), $(window).height());

    function do_update() {
      labyrinth.do_update();
      labyrinth.draw();
    }

    $(document).on('keydown', function (event) {
      if (labyrinth.pressed.has(event.key)) {
        labyrinth.pressed.set(event.key, true);
      }
    });

    $(document).on('keyup', function (event) {
      if (labyrinth.pressed.has(event.key)) {
        labyrinth.pressed.set(event.key, false);
      }
    });

    function timeout_func() {
      do_update();
      setTimeout(timeout_func, 1000 / labyrinth.fps);
    }

    setTimeout(timeout_func, 1000 / labyrinth.fps);

    const font = new FontFaceObserver('Inconsolata');

    font.load().then(function () {
      labyrinth.draw();
    });
  }
}
