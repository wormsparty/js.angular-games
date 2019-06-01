import {Editor} from './editor';
import {Engine} from '../common/engine';
import {Tileset} from './tileset';

class Cell {
  public tileset: string;
  public tileX: number;
  public tileY: number;
}

class Pos {
  public x: number;
  public y: number;
}

export class Level {
  private engine: Engine;

  private tilesets: Map<string, Tileset>;
  public tilesize: number;

  public cells: Map<Pos, Cell>;

  private isClicking = false;

  public shiftLeft = 0;
  public shiftTop = 0;

  setHandles(engine: Engine, tilesets: Map<string, Tileset>, tilesize: number) {
    this.engine = engine;
    this.tilesets = tilesets;
    this.tilesize = tilesize;
    this.cells = new Map<Pos, Cell>();
  }

  draw(editor: Editor) {
    let editorOuterWidth = 0;
    let editorTopHeight = 0;

    if (editor != null) {
      editorOuterWidth = editor.outerWidth();
      editorTopHeight = editor.outerHeight();
    }

    let cellHighlighted = false;

    for (const [pos, cell] of this.cells) {
      const tileset = this.tilesets.get(cell.tileset);

      const xx = (pos.x + this.shiftLeft) * this.tilesize;
      const yy = (pos.y + this.shiftTop) * this.tilesize;

      if (xx < 0 || xx >= this.engine.referenceWidth - editorOuterWidth
       || yy < 0 || yy >= this.engine.referenceHeight) {
        continue;
      }

      this.engine.img(tileset, {x: xx + editorOuterWidth, y: yy + editorTopHeight}, cell.tileX, cell.tileY);

      if (this.engine.mousePosX >= xx && this.engine.mousePosX < xx + this.tilesize
        && this.engine.mousePosY >= yy && this.engine.mousePosY < yy + this.tilesize
        && xx < this.engine.referenceWidth) {
        this.engine.rect({x: xx, y: yy}, this.tilesize, this.tilesize, 'rgba(55, 55, 55, 0.5)');
        cellHighlighted = true;
      }
    }

    if (!cellHighlighted && this.engine.mousePosX >= editorOuterWidth) {
      const xx = this.engine.mousePosX - (this.engine.mousePosX - editorOuterWidth) % this.tilesize;
      const yy = this.engine.mousePosY - (this.engine.mousePosY - editorTopHeight) % this.tilesize;

      this.engine.rect({x: xx, y: yy}, this.tilesize, this.tilesize, 'rgba(55, 55, 55, 0.5)');
    }
  }

  onMouseMove(editor: Editor) {
    if (!this.isClicking || editor == null) {
      return;
    }

    const editorWidth = editor.outerWidth();
    const topBarHeight = editor.outerHeight();

    const xx = Math.floor((this.engine.mousePosX - editorWidth) / this.tilesize);
    const yy = Math.floor((this.engine.mousePosY - topBarHeight) / this.tilesize);

    const horizTiles = (this.engine.referenceWidth - editorWidth) / this.tilesize;
    const vertTiles = (this.engine.referenceHeight - topBarHeight) / this.tilesize;

    if (xx >= 0 && yy >= 0 && xx < horizTiles && yy < vertTiles) {
      this.cells.set({x: xx - this.shiftLeft, y: yy - this.shiftTop}, {tileset: editor.currentMenu, tileX: editor.currentTileIndexX, tileY: editor.currentTileIndexY});
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
