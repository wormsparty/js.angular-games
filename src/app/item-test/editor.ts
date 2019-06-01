import {Tileset} from './tileset';
import {Engine} from '../common/engine';

export class Editor {
  public currentTileIndexX = 0;
  public currentTileIndexY = 0;

  private readonly leftPanelWidth = 110;
  private readonly topBarHeight = 10;
  private readonly margin = 6;

  private engine: Engine;
  private tileset: Tileset;

  setHandles(engine: Engine, tileset: Tileset) {
    this.engine = engine;
    this.tileset = tileset;
  }
  innerWidth() {
    return this.leftPanelWidth;
  }
  outerWidth() {
    return this.leftPanelWidth + this.margin;
  }
  outerHeight() {
    return this.topBarHeight + this.margin;
  }
  draw() {
    const width = this.tileset.image.width;
    const height = this.tileset.image.height;

    const tileSizeX = this.tileset.tilesizeX;
    const tileSizeY = this.tileset.tilesizeY;

    const maxX = width / tileSizeX;
    const maxY = height / tileSizeY;

    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        const xx = x * tileSizeX;
        const yy = y * tileSizeY + this.outerHeight();

        this.engine.img(this.tileset, {x: xx, y: yy}, x, y);

        if (x === this.currentTileIndexX && y === this.currentTileIndexY) {
          this.engine.rect({x: xx, y: yy}, 16, 16, 'rgba(25, 25, 25, 0.5)');
        } else if (this.engine.mousePosX >= xx && this.engine.mousePosX < xx + tileSizeX
          && this.engine.mousePosY >= yy && this.engine.mousePosY < yy + tileSizeY) {
          this.engine.rect({x: xx, y: yy}, 16, 16, 'rgba(55, 55, 55, 0.5)');
        }
      }
    }

    this.engine.rect({x: this.leftPanelWidth, y: 0}, this.margin, this.engine.referenceHeight, '#000000');

    this.engine.text('tiles', {x: 4, y: 8}, '#000');
    this.engine.text('foes', {x: 37, y: 8}, '#000');
    this.engine.text('goodies', {x: 68, y: 8}, '#000');
  }

  onClick(): boolean {
    if (this.engine.mousePosX < this.leftPanelWidth) {
      const xx = Math.floor(this.engine.mousePosX / this.tileset.tilesizeX);
      const yy = Math.floor((this.engine.mousePosY - this.outerHeight()) / this.tileset.tilesizeY);

      const horizTiles = this.tileset.image.width / this.tileset.tilesizeX;
      const vertTiles = this.tileset.image.height / this.tileset.tilesizeY;

      if (xx >= 0 && yy >= 0 && xx < horizTiles && yy < vertTiles) {
        this.currentTileIndexX = xx;
        this.currentTileIndexY = yy;
      }

      return true;
    }

    return false;
  }
}
