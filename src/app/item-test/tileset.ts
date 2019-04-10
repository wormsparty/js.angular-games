import {TextureLoader} from './textureloader';

export class Tileset {
  private readonly tilesizeX: number;
  private readonly tilesizeY: number;
  public readonly image: HTMLImageElement;

  constructor(filename: string, tilesizeX: number, tilesizeY: number, loader: TextureLoader) {
    this.tilesizeX = tilesizeX;
    this.tilesizeY = tilesizeY;
    this.image = loader.load(filename);
  }
}
