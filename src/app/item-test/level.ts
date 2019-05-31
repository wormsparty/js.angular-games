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

    if (editor != null) {
      editorOuterWidth = editor.outerWidth();
    }

    const width = this.engine.reference_width - editorOuterWidth;
    const height = this.engine.reference_height;

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

    if (editor != null) {
      editorInnerWidth = editor.innerWidth();
      editorOuterWidth = editor.outerWidth();
    }

    const width = this.engine.reference_width - editorOuterWidth;
    const height = this.engine.reference_height;

    const tileSizeX = this.tileset.tilesizeX;
    const tileSizeY = this.tileset.tilesizeY;

    const maxX = Math.floor(width / tileSizeX);
    const maxY = Math.floor(height / tileSizeY);

    const deltaX = editorOuterWidth;

    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        const xx = x * tileSizeX + deltaX;
        const yy = y * tileSizeY;

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
          && xx < this.engine.reference_width) {
          this.engine.rect({x: xx, y: yy}, 16, 16, 'rgba(55, 55, 55, 0.5)');
        }
      }
    }
  }

  onMouseMove(editor: Editor) {
    if (!this.isClicking) {
      return;
    }

    let editorWidth = 0;

    if (editor != null) {
      editorWidth = editor.outerWidth();
    }

    const xx = Math.floor((this.engine.mousePosX - editorWidth) / this.tileset.tilesizeX);
    const yy = Math.floor(this.engine.mousePosY / this.tileset.tilesizeY);

    const horizTiles = (this.engine.reference_width - editorWidth) / this.tileset.tilesizeX;
    const vertTiles = this.engine.reference_height / this.tileset.tilesizeY;

    if (xx >= 0 && yy >= 0 && xx < horizTiles && yy < vertTiles) {
      const tilesetWidth = this.tileset.image.width;
      const referenceWidth = this.engine.reference_width - editorWidth;

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
