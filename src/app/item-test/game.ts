import {Engine} from '../common/engine';
import {Tileset} from './tileset';
import {TextureLoader} from './textureloader';

export class Game {
  public pressed: Map<string, boolean>;

  public readonly engine: Engine;
  private textureLoader: TextureLoader;
  private tilesets: Tileset[];

  fps: number;

  draw(): void {
    this.engine.clear('#888888');

    if (!this.textureLoader.isInitialized) {
      this.engine.textCentered('Loading...', 40, '#FFFFFF');
    } else {
      const width = this.tilesets[0].image.width;
      const height = this.tilesets[0].image.height;

      const tileSizeX = this.tilesets[0].tilesizeX;
      const tileSizeY = this.tilesets[0].tilesizeY;

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const xx = x * tileSizeX;
          const yy = y * tileSizeY;

          if (this.engine.mousePosX >= xx && this.engine.mousePosX < xx + tileSizeX
           &&  this.engine.mousePosY >= yy &&  this.engine.mousePosY < yy + tileSizeY) {
            // NOP
          } else {
            this.engine.img(this.tilesets[0], {x: xx, y: yy}, x, y);
          }
        }
      }

//      this.engine.img(this.tilesets[0], {x: 0, y: 0}, 0, 0);
  //    this.engine.img(this.tilesets[1], {x: 32, y: 32}, 0, 0);
    }
  }
  doUpdate(): void {
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
      'monospace');

    this.pressed = new Map([
      ['ArrowUp', false],
      ['ArrowDown', false],
      ['ArrowLeft', false],
      ['ArrowRight', false],
      ['Enter', false],
      [' ', false],
      ['Shift', false],
      ['Escape', false],
    ]);

    this.textureLoader = new TextureLoader();
    this.fps = 30;
  }
  loop() {
    const allTilesetsLoaded = () => {
      this.updateAndDraw();
    };

    this.textureLoader.setLoadedFunction(allTilesetsLoaded);
    this.tilesets = [];
    this.tilesets[0] = new Tileset('../../assets/celianna_TileA1.png', 32, 32, this.textureLoader);
    this.tilesets[1] = new Tileset('../../assets/celianna_TileA2.png', 32, 32, this.textureLoader);
    this.textureLoader.waitLoaded();
  }
  updateAndDraw() {
    const that = this;

    function timeoutFunc() {
      that.doUpdate();
      that.draw();

      setTimeout(timeoutFunc, 1000 / that.fps);
    }

    setTimeout(timeoutFunc, 1000 / this.fps);
  }
}
