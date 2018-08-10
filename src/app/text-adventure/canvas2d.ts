export class Canvas2D {
  private readonly ctx;
  private readonly reference_width: number;
  private readonly reference_height: number;
  private readonly font_size: number;
  private readonly font: string;
  private readonly font_family: string;
  private scaleFactor: number;
  private margin_left: number;
  private margin_right: number;
  private margin_top: number;
  private margin_bottom: number;
  private window_width: number;
  private window_height: number;

  constructor(canvas, reference_width, reference_height, font_size, font_family) {
    this.ctx = canvas.getContext('2d');
    this.scaleFactor = 1;
    this.margin_left = 0;
    this.margin_right = 0;
    this.margin_top = 0;
    this.margin_bottom = 0;
    this.window_width = 0;
    this.window_height = 0;
    this.reference_width = reference_width;
    this.reference_height = reference_height;
    this.font_size = font_size;
    this.font_family = font_family;
    this.font = font_size + 'px ' + font_family;
  }
  resize(scaleFactor, margin_left, margin_right, margin_top, margin_bottom, window_width, window_height) {
    this.scaleFactor = scaleFactor;
    this.margin_left = margin_left;
    this.margin_right = margin_right;
    this.margin_top = margin_top;
    this.margin_bottom = margin_bottom;
    this.window_width = window_width;
    this.window_height = window_height;

    // This needs to be done at each resizing!
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.oImageSmoothingEnabled = false;
  }
  /*render (sprite, pos) {
    const sx = sprite.frame_width * sprite.frame_current;
    const sy = sprite.frame_height * sprite.variant_current;
    const w = sprite.frame_width;
    const h = sprite.frame_height;

      let cutLeft = 0;
      let cutRight = 0;
      let cutTop = 0;
      let cutBottom = 0;

      if (pos.x !== Math.floor(pos.x)) {
        console.error('x should be an integer! x=' + pos.x);
      }

      if (pos.y !== Math.floor(pos.y)) {
        console.error('y should be an integer! y=' + pos.y);
      }

      if (pos.x < 0) {
        cutLeft = -pos.x;
      }

      if (pos.y < 0) {
        cutTop = -pos.y;
      }

      if (pos.x + w > this.handle.reference_width) {
        cutRight = pos.x + w - this.handle.reference_width;
      }

      if (pos.y + h > this.handle.reference_height) {
        cutBottom = pos.y + h - this.handle.reference_height;
      }

      if (cutLeft < w
        && cutRight < w
        && cutTop < h
        && cutBottom < h) {
        const target_x = (pos.x + cutLeft) * this.handle.scaleFactor + this.handle.margin_left;
        const target_y = (pos.y + cutTop) * this.handle.scaleFactor + this.handle.margin_top;

        this.handle.ctx.drawImage(
          sprite.imageSrc,
          sx + cutLeft,
          sy + cutTop,
          sprite.frame_width - cutLeft - cutRight,
          sprite.frame_height - cutTop - cutBottom,
          target_x,
          target_y,
          (pos.w - cutLeft - cutRight) * this.handle.scaleFactor,
          (pos.h - cutTop - cutBottom) * this.handle.scaleFactor);
    }
  }*/
  rect (pos, w, h, color) {
    this.ctx.fillStyle = color;

    let x = pos.x;
    let y = pos.y;

    if (x < 0) {
      w += x;
      x = 0;
    }

    if (y < 0) {
      h += y;
      y = 0;
    }

    if (x >= this.reference_width) {
      w -= x - this.reference_width;
      x = this.reference_width - 1;
    }

    if (y >= this.reference_height) {
      h -= y - this.reference_height;
      y = this.reference_height - 1;
    }

    if (w <= 0 || h <= 0) {
      return;
    }

    this.ctx.fillRect(
    this.margin_left + x * this.scaleFactor,
    this.margin_top + y * this.scaleFactor,
      w * this.scaleFactor,
      h * this.scaleFactor);
  }
  text (str, pos, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = this.font;

    // TODO: Don't draw text outside
    const x = pos.x;
    const y = pos.y + this.font_size - 3;

    this.ctx.save();
    this.ctx.translate(this.margin_left, this.margin_top);
    this.ctx.scale(this.scaleFactor, this.scaleFactor);

    this.ctx.fillText(str, x, y);
    this.ctx.restore();
  }
  clear (color) {
    this.ctx.fillStyle = 'rgba(5, 5, 5, 1)';
    // handle.ctx.fillRect(0, 0, handle.window_width, handle.window_height);

    const ml = this.margin_left;
    const mr = this.margin_right;
    const mb = this.margin_bottom;
    const mt = this.margin_top;
    const ww = this.window_width;
    const wh = this.window_height;

    // Left band
    // this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    this.ctx.fillRect(0, 0, ml, wh);
    // Top band
    // this.ctx.fillStyle = 'rgba(255, 255, 0, 1)';
    this.ctx.fillRect(ml, 0, ww - mr - ml, mt);
    // Right band
    // this.ctx.fillStyle = 'rgba(255, 0, 255, 1)';
    this.ctx.fillRect(ww - mr, 0, mr, wh);
    // Bottom band
    // this.ctx.fillStyle = 'rgba(0, 255, 255, 1)';
    this.ctx.fillRect(ml, wh - mb, ww - mr - ml, mb);

    this.ctx.fillStyle = color;
    this.ctx.fillRect(ml, mt, ww - ml - mr, wh - mb - mt);
  }
  get_char_width () {
    return 8;
  }
}
