import {Editor} from './editor';
import {Engine} from '../common/engine';
import {Tileset} from './tileset';

export class Level {
  private engine: Engine;
  private tileset: Tileset;
  public pos2tile: Array<number>;
  private isClicking = false;

  setHandles(engine: Engine, tileset: Tileset, editor: Editor) {
    this.engine = engine;
    this.tileset = tileset;

    this.pos2tile = [];

    let editorOuterWidth = 0;
    let topBarHeight = 0;

    if (editor != null) {
      editorOuterWidth = editor.outerWidth();
      topBarHeight = editor.outerHeight();
    }

    const width = this.engine.referenceWidth - editorOuterWidth;
    const height = this.engine.referenceHeight - topBarHeight;

    const tileSizeX = this.tileset.tilesizeX;
    const tileSizeY = this.tileset.tilesizeY;

    const maxX = width / tileSizeX;
    const maxY = height / tileSizeY;

    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        this.pos2tile[x + y * maxX] = -1;
      }
    }
  }

  draw(editor: Editor) {
    let editorInnerWidth = 0;
    let editorOuterWidth = 0;
    let editorTopHeight = 0;

    if (editor != null) {
      editorInnerWidth = editor.innerWidth();
      editorOuterWidth = editor.outerWidth();
      editorTopHeight = editor.outerHeight();
    }

    const width = this.engine.referenceWidth - editorOuterWidth;
    const height = this.engine.referenceHeight;

    const tileSizeX = this.tileset.tilesizeX;
    const tileSizeY = this.tileset.tilesizeY;

    const maxX = Math.floor(width / tileSizeX);
    const maxY = Math.floor(height / tileSizeY);

    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        const xx = x * tileSizeX + editorOuterWidth;
        const yy = y * tileSizeY + editorTopHeight;

        const index = x + y * maxX;
        const tileIndex = this.pos2tile[index];

        if (tileIndex !== -1) {
          const tileMaxX = Math.floor(editorInnerWidth / tileSizeX) + 1;

          const tileX = tileIndex % tileMaxX;
          const tileY = Math.floor(tileIndex / tileMaxX);

          this.engine.img(this.tileset, {x: xx, y: yy}, tileX, tileY);
        }

        if (this.engine.mousePosX >= xx && this.engine.mousePosX < xx + tileSizeX
          && this.engine.mousePosY >= yy && this.engine.mousePosY < yy + tileSizeY
          && xx < this.engine.referenceWidth) {
          this.engine.rect({x: xx, y: yy}, 16, 16, 'rgba(55, 55, 55, 0.5)');
        }
      }
    }
  }

  onMouseMove(editor: Editor) {
    if (!this.isClicking || editor == null) {
      return;
    }

    const editorWidth = editor.outerWidth();
    const topBarHeight = editor.outerHeight();

    const xx = Math.floor((this.engine.mousePosX - editorWidth) / this.tileset.tilesizeX);
    const yy = Math.floor((this.engine.mousePosY - topBarHeight) / this.tileset.tilesizeY);

    const horizTiles = (this.engine.referenceWidth - editorWidth) / this.tileset.tilesizeX;
    const vertTiles = (this.engine.referenceHeight - topBarHeight) / this.tileset.tilesizeY;

    if (xx >= 0 && yy >= 0 && xx < horizTiles && yy < vertTiles) {
      const tilesetWidth = this.tileset.image.width;
      const referenceWidth = this.engine.referenceWidth - editorWidth;

      const tileSizeX = this.tileset.tilesizeX;
      const maxX1 = tilesetWidth / tileSizeX;
      const maxX2 = referenceWidth / tileSizeX;

      const selectedTileIndex = editor.currentTileIndexX + editor.currentTileIndexY * maxX1;
      const selectedCell = xx + yy * maxX2;

      this.pos2tile[selectedCell] = selectedTileIndex;
    }
  }

  mouseDown(editor: Editor) {
    this.isClicking = true;
    this.onMouseMove(editor);
  }

  mouseUp() {
    this.isClicking = false;
  }
}
