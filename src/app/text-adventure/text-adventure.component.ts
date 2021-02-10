import { Component, OnInit} from '@angular/core';
import { Labyrinth } from './labyrinth';
import * as FontFaceObserver from 'fontfaceobserver';

@Component({
  selector: 'app-text-adventure',
  templateUrl: './text-adventure.component.html',
  styleUrls: ['./text-adventure.component.css'],
})
export class TextAdventureComponent implements OnInit {
  private labyrinth: Labyrinth;

  doUpdate() {
    this.labyrinth.do_update();
    this.labyrinth.draw();

    for (const [key] of this.labyrinth.pressed) {
      this.labyrinth.pressed.set(key, false);
    }
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';

    const labyrinth = new Labyrinth('canvas-text');
    this.labyrinth = labyrinth;
    this.labyrinth.resize(window.innerWidth, window.innerHeight);

    setInterval(() => {
      if (labyrinth.persistedData !== undefined && labyrinth.persistedData.isRt) {
        this.doUpdate();
      }
    }, 1000 / labyrinth.fps);

    const font = new FontFaceObserver('Inconsolata');

    font.load().then(() => {
      labyrinth.draw();
    });
  }

  onResize(event) {
    this.labyrinth.resize(event.target.innerWidth, event.target.innerHeight);
  }

  onKeydown(event) {
    let update = false;

    if (this.labyrinth.pressed.has(event.key)) {
      this.labyrinth.pressed.set(event.key, true);
      update = true;
    } else {
      if (event.key === 'ArrowLeft') {
        this.labyrinth.pressed.set('4', true);
        update = true;
      } else if (event.key === 'ArrowRight') {
        this.labyrinth.pressed.set('6', true);
        update = true;
      } else if (event.key === 'ArrowUp') {
        this.labyrinth.pressed.set('8', true);
        update = true;
      } else if (event.key === 'ArrowDown') {
        this.labyrinth.pressed.set('2', true);
        update = true;
      } else if (event.key === 'Enter') {
        this.labyrinth.pressed.set('5', true);
        update = true;
      }
    }

    if (update && (this.labyrinth.persistedData === undefined || !this.labyrinth.persistedData.isRt)) {
      this.doUpdate();
    }
  }
}
