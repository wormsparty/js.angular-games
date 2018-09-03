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

      for (const [key, pressed] of labyrinth.pressed) {
        labyrinth.pressed.set(key, false);
      }
    }

    $(document).on('keydown', function (event) {
      let update = false;

      if (labyrinth.pressed.has(event.key)) {
        labyrinth.pressed.set(event.key, true);
        update = true;
      } else {
        if (event.key === 'ArrowLeft') {
          labyrinth.pressed.set('4', true);
          update = true;
        } else if (event.key === 'ArrowRight') {
          labyrinth.pressed.set('6', true);
          update = true;
        } else if (event.key === 'ArrowUp') {
          labyrinth.pressed.set('8', true);
          update = true;
        } else if (event.key === 'ArrowDown') {
          labyrinth.pressed.set('2', true);
          update = true;
        } else if (event.key === 'Enter') {
          labyrinth.pressed.set('5', true);
          update = true;
        }
      }

      if (update && (labyrinth.persisted_data === undefined || !labyrinth.persisted_data.is_rt)) {
        do_update();
      }
    });

    function timeout_func() {
      if (labyrinth.persisted_data !== undefined && labyrinth.persisted_data.is_rt) {
        do_update();
      }

      setTimeout(timeout_func, 1000 / labyrinth.fps);
    }

    setTimeout(timeout_func, 1000 / labyrinth.fps);

    const font = new FontFaceObserver('Inconsolata');

    font.load().then(function () {
      labyrinth.draw();
    });
  }
}
