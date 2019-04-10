export class Tileset {
  private readonly tilesizeX: number;
  private readonly tilesizeY: number;
  public readonly image: HTMLImageElement;

  constructor(filename: string, tilesizeX: number, tilesizeY: number, texture_loaded: () => void) {
    this.tilesizeX = tilesizeX;
    this.tilesizeY = tilesizeY;

    const img: HTMLImageElement = new Image();

    img.onload = () => {
      texture_loaded();
    };

    img.src = filename;
    this.image = img;
  }
}
