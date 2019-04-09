import {Engine} from '../common/engine';
import {Tileset} from './tileset';

export class Game {
  public pressed: Map<string, boolean>;

  private readonly engine: Engine;
  private readonly tileset: Tileset;

  fps: number;

  draw(): void {
    this.engine.clear('#111111');
    this.engine.rect({x: 100, y: 100}, 100, 100, '#FF0000');
  }
  do_update(): void {
    // TODO
  }
  resize(width, height): void {
    this.engine.resize(width, height);
    this.draw();
  }
  constructor() {
    this.engine = new Engine(
      'canvas',
      460,
      480,
      16,
      'Inconsolata, monospace');

    this.pressed = new Map([
      [ 'ArrowUp', false ],
      [ 'ArrowDown', false ],
      [ 'ArrowLeft', false ],
      [ 'ArrowRight', false ],
      [ 'Enter', false ],
      [ ' ', false ],
      [ 'Shift', false ],
      [ 'Escape', false ],
    ]);

    this.fps = 30;

    this.tileset = new Tileset('celianna_TileA1.png', 32, 32);
  }
}
