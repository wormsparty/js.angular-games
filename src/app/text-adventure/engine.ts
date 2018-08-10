import { Canvas2D } from './canvas2d';
// import { WebAudio } from './webaudio';

function get_zoom(width, height, reference_width, reference_height) {
  const zoom_x = width / reference_width;
  const zoom_y = height / reference_height;
  let zoom = zoom_x;

  if (zoom_y < zoom) {
    zoom = zoom_y;
  }

  return zoom;
}

export class Engine {
  private readonly canvas;
  private readonly graphics: Canvas2D;
  // private readonly audio: WebAudio;

  readonly reference_width: number;
  readonly reference_height: number;
  readonly margin_top: number;

  clear(color) {
    this.graphics.clear(color);
  }
  rect(pos, w, h, color) {
    this.graphics.rect(pos, w, h, color);
  }
  text(str, coord, color) {
    this.graphics.text(str, coord, color);
  }
  get_char_width() {
    return this.graphics.get_char_width();
  }
  /*load_sound(file, onload, onfailure) {
    this.audio.load(file, onload, onfailure);
  }
  play(filename) {
    this.audio.play(filename);
  }*/
  resize(width, height) {
    height -= this.margin_top;

    const zoom = get_zoom(width, height, this.reference_width, this.reference_height);

    const borderx = Math.floor((width - this.reference_width * zoom) / 2);
    const bordery = Math.floor((height - this.reference_height * zoom) / 2);
    const ajustementx = Math.floor(width - this.reference_width * zoom - borderx * 2);
    const ajustementy = Math.floor(height - this.reference_height * zoom - bordery * 2);

    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.marginTop = this.margin_top + 'px';

    this.graphics.resize(zoom, borderx + ajustementx, borderx, bordery + ajustementy, bordery, width, height);
  }
  /*load_image(desc, onload, onfailure) {
    const imageSrc = new Image();
    imageSrc.src = desc.url;

    const sprite = {
      imageSrc: imageSrc,
      frame_current: 0,
      frame_count: desc.frame_count,
      frame_width: 0,
      frame_height: 0,
      variant_count: 1, // TODO: We leave one variant for images for now
      variant_current: 0,
      x: desc.x,
      y: desc.y,
      render: function(frame) {},
      move: function(dx, dy) {}
    };

    imageSrc.onload = function() {
      sprite.frame_width = imageSrc.width / sprite.frame_count;
      sprite.frame_height = imageSrc.height / sprite.variant_count;

      sprite.render = function(frame) {
        sprite.frame_current = frame;
        sprite.render(frame);
      };

      sprite.move = function(dx, dy) {
        sprite.x += dx;
        sprite.y += dy;
      };

      onload(desc.url);
    };

    imageSrc.onerror = function() {
      onfailure();
    };

    return sprite;
  }*/
  constructor(canvasId, width, height, font_size, font_family, margin_top) {
    this.canvas = document.getElementById(canvasId);
    this.graphics = new Canvas2D(this.canvas, width, height, font_size, font_family);
    /*this.audio = new WebAudio();

    if (!this.audio) {
      console.log('Failed to initialize WebAudio.');
      return;
    }*/

    if (!this.graphics) {
      console.log('Failed to load Canvas2D.');
      return;
    }

    this.reference_width = width;
    this.reference_height = height;
    this.margin_top = margin_top;

    this.canvas.focus();
  }
}
