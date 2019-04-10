import {Engine} from '../common/engine';
import {Tileset} from './tileset';

export class Game {
  public pressed: Map<string, boolean>;

  private readonly engine: Engine;
  private readonly tilesets: Tileset[];
  private loaded_tilesets = 0;
  private tilesets_loaded = false;

  fps: number;

  draw(): void {
    this.engine.clear('#888888');
    this.engine.img(this.tilesets[0], {x: 100, y: 100});
    this.engine.img(this.tilesets[1], {x: 200, y: 200});
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

    const all_tilesets_loaded = () => {
      this.loaded_tilesets++;

      if (this.tilesets_loaded && this.loaded_tilesets === this.tilesets.length) {
        this.loop();
      }
    };

    this.tilesets = [];
    this.tilesets[0] = new Tileset('../../assets/celianna_TileA1.png', 32, 32, all_tilesets_loaded);
    this.tilesets[1] = new Tileset('../../assets/celianna_TileA2.png', 32, 32, all_tilesets_loaded);
    this.tilesets_loaded = true;

    if (this.tilesets.length === this.loaded_tilesets) {
      all_tilesets_loaded();
    }
  }
  loop() {
    const that = this;

    function timeout_func() {
      that.do_update();
      that.draw();

      setTimeout(timeout_func, 1000 / that.fps);
    }

    setTimeout(timeout_func, 1000 / this.fps);
  }
}
