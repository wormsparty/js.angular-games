import {Engine} from '../common/engine';
import {Tileset} from './tileset';
import {TextureLoader} from './textureloader';

export class Game {
  public pressed: Map<string, boolean>;

  public readonly engine: Engine;
  private textureLoader: TextureLoader;
  private tileset: Tileset;

  private currentTileIndexX = 0;
  private currentTileIndexY = 0;

  private readonly leftPanelWidth = 110;
  private readonly panelMargin = 10;

  fps: number;

  constructor() {
    this.engine = new Engine(
      'canvas',
      460 + this.leftPanelWidth + this.panelMargin,
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
    this.tileset = new Tileset('../../assets/tileset.png', 16, 16, this.textureLoader);
    this.textureLoader.waitLoaded();
  }
  updateAndDraw() {
    setInterval(() => {
      this.doUpdate();
      this.draw();
    }, 1000 / this.fps);
  }
  draw(): void {
    this.engine.clear('#888888');

    if (!this.textureLoader.isInitialized) {
      this.engine.textCentered('Loading...', 40, '#FFFFFF');
    } else {
      const width = this.tileset.image.width;
      const height = this.tileset.image.height;

      const tileSizeX = this.tileset.tilesizeX;
      const tileSizeY = this.tileset.tilesizeY;

      const maxX = width / tileSizeX;
      const maxY = height / tileSizeY;

      for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
          const xx = x * tileSizeX;
          const yy = y * tileSizeY;

          this.engine.img(this.tileset, {x: xx, y: yy}, x, y);

          if (x === this.currentTileIndexX && y === this.currentTileIndexY) {
            this.engine.rect({x: xx, y: yy}, 16, 16, 'rgba(25, 25, 25, 0.5)');
          } else if (this.engine.mousePosX >= xx && this.engine.mousePosX < xx + tileSizeX
           &&  this.engine.mousePosY >= yy &&  this.engine.mousePosY < yy + tileSizeY) {
            this.engine.rect({x: xx, y: yy}, 16, 16, 'rgba(55, 55, 55, 0.5)');
          }
        }
      }

      this.engine.rect({x: this.leftPanelWidth, y: 0}, this.panelMargin, 480, '#000000');

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
  setMousePos(x, y) {
    this.engine.setMousePos(x, y);
  }
  click(x, y) {
    this.engine.click(x, y);

    if (this.engine.mousePosX < this.leftPanelWidth) {
      const xx = Math.floor(this.engine.mousePosX / this.tileset.tilesizeX);
      const yy = Math.floor(this.engine.mousePosY / this.tileset.tilesizeY);

      const horizTiles = this.tileset.image.width / this.tileset.tilesizeX;
      const vertTiles = this.tileset.image.height / this.tileset.tilesizeY;

      if (xx >= 0 && yy >= 0 && xx < horizTiles && yy < vertTiles) {
        this.currentTileIndexX = xx;
        this.currentTileIndexY = yy;
      }
    }
  }
}
