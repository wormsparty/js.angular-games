import { Canvas2D } from './canvas2d';
import {Tileset} from '../item-test/tileset';
// import { WebAudio } from './webaudio';

export class Engine {
  private readonly canvas;
  private readonly graphics: Canvas2D;
  // private readonly audio: WebAudio;

  readonly referenceWidth: number;
  readonly referenceHeight: number;

  public integerZoom: boolean;

  public mousePosX: number;
  public mousePosY: number;

  setMousePos(x, y) {
    this.mousePosX = Math.floor((x - this.graphics.marginLeft) / this.graphics.scaleFactor);
    this.mousePosY = Math.floor((y - this.graphics.marginTop) / this.graphics.scaleFactor);
  }
  click(x, y) {
    this.setMousePos(x, y);
  }
  clear(color) {
    this.graphics.clear(color);
  }
  rect(pos, w, h, color) {
    this.graphics.rect(pos, w, h, color);
  }
  text(str, coord, color) {
    this.graphics.text(str, coord, color);
  }
  textCentered(text: string, yy: number, color: string) {
    const coord = {x: this.referenceWidth / 2 - this.get_char_width() * text.length / 2, y: yy};
    this.text(text, coord, color);
  }
  get_char_width() {
    return this.graphics.get_char_width();
  }
  img(tileset: Tileset, pos, x: number, y: number) {
    this.graphics.img(tileset, pos, x, y);
  }
  /*load_sound(file, onload, onfailure) {
    this.audio.load(file, onload, onfailure);
  }
  play(filename) {
    this.audio.play(filename);
  }*/
  getZoom(width, height, referenceWidth, referenceHeight) {
    const zoomX = width / referenceWidth;
    const zoomY = height / referenceHeight;
    let zoom = zoomX;

    if (zoomY < zoom) {
      zoom = zoomY;
    }

    if (this.integerZoom) {
      zoom = Math.floor(zoom);

      if (zoom < 1) {
        zoom = 1;
      }

      return zoom;
    } else {
      return zoom;
    }
  }
  resize(width, height) {
    const zoom = this.getZoom(width, height, this.referenceWidth, this.referenceHeight);

    const borderx = Math.floor((width - this.referenceWidth * zoom) / 2);
    const bordery = Math.floor((height - this.referenceHeight * zoom) / 2);
    const ajustementx = Math.floor(width - this.referenceWidth * zoom - borderx * 2);
    const ajustementy = Math.floor(height - this.referenceHeight * zoom - bordery * 2);

    this.canvas.width = width;
    this.canvas.height = height;

    this.graphics.resize(zoom, borderx + ajustementx, borderx, bordery + ajustementy, bordery, width, height);
  }
  constructor(canvasId, width, height, fontSize, fontFamily, integerZoom) {
    this.canvas = document.getElementById(canvasId);
    this.graphics = new Canvas2D(this.canvas, width, height, fontSize, fontFamily);
    /*this.audio = new WebAudio();

    if (!this.audio) {
      console.log('Failed to initialize WebAudio.');
      return;
    }*/

    if (!this.graphics) {
      console.log('Failed to load Canvas2D.');
      return;
    }

    this.referenceWidth = width;
    this.referenceHeight = height;
    this.integerZoom = integerZoom;

    this.canvas.focus();
  }
}
