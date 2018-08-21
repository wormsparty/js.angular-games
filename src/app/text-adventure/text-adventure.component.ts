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
  private labyrinth;

  ngOnInit() {
    document.body.style.overflow = 'hidden';

    const labyrinth = new Labyrinth();
    this.labyrinth = labyrinth;

    $(window).resize(function () {
      labyrinth.resize($(window).width(), $(window).height());
    });

    this.labyrinth.resize($(window).width(), $(window).height());

    $(document).on('keydown', function (event) {
      let update = false;

      if (labyrinth.pressed.has(event.key)) {
        labyrinth.pressed.set(event.key, true);
        update = true;
      } else {
        if (event.key === 'ArrowLeft') {
          labyrinth.pressed.set('4', true);
        } else if (event.key === 'ArrowRight') {
          labyrinth.pressed.set('6', true);
        } else if (event.key === 'ArrowUp') {
          labyrinth.pressed.set('8', true);
        } else if (event.key === 'ArrowDown') {
          labyrinth.pressed.set('2', true);
        }
      }

      if (update) {
        labyrinth.do_update();
        labyrinth.draw();
      }
    });

    $(document).on('keyup', function (event) {
      if (labyrinth.pressed.has(event.key)) {
        labyrinth.pressed.set(event.key, false);
      } else {
        if (event.key === 'ArrowLeft') {
          labyrinth.pressed.set('4', false);
        } else if (event.key === 'ArrowRight') {
          labyrinth.pressed.set('6', false);
        } else if (event.key === 'ArrowUp') {
          labyrinth.pressed.set('8', false);
        } else if (event.key === 'ArrowDown') {
          labyrinth.pressed.set('2', false);
        }
      }
    });

    const font = new FontFaceObserver('Inconsolata');

    font.load().then(function () {
      labyrinth.draw();
    });
  }
}
