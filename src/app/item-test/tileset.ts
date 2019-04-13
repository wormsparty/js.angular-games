import {TextureLoader} from './textureloader';

export class Tileset {
  public readonly tilesizeX: number;
  public readonly tilesizeY: number;
  public readonly image: HTMLImageElement;

  constructor(filename: string, tilesizeX: number, tilesizeY: number, loader: TextureLoader) {
    this.tilesizeX = tilesizeX;
    this.tilesizeY = tilesizeY;
    this.image = loader.load(filename);
  }
}
