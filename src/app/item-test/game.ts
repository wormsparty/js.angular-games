import {Engine} from '../common/engine';
import {Tileset} from './tileset';
import {TextureLoader} from './textureloader';
import {Level} from './level';
import {Editor} from './editor';

export class Game {
  public pressed: Map<string, boolean>;

  public readonly engine: Engine;
  private textureLoader: TextureLoader;
  private tileset: Tileset;

  private editor: Editor;
  private level: Level;

  fps: number;

  constructor(enableEditor: boolean) {
    let width = 448;

    if (enableEditor) {
      this.editor = new Editor();
      width += this.editor.outerWidth();
    } else {
      this.editor = null;
    }

    this.level = new Level();

    this.engine = new Engine(
      'canvas',
      width,
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

    if (this.editor != null) {
      this.editor.setHandles(this.engine, this.tileset);
    }

    this.level.setHandles(this.engine, this.tileset, this.editor);

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
      if (this.editor != null) {
        this.editor.draw();
      }

      this.level.draw(this.editor);
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
    if (this.engine !== undefined && this.engine != null) {
      this.engine.setMousePos(x, y);
      this.level.onMouseMove(this.editor);
    }
  }
  mouseDown(x, y) {
    this.engine.click(x, y);

    if (this.editor == null || !this.editor.onClick()) {
      this.level.mouseDown(this.editor);
    }
  }
  mouseUp() {
    this.level.mouseUp();
  }
}
