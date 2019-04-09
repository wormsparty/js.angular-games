
export class Tileset {
  private readonly filename: string;
  private readonly tilesizeX: number;
  private readonly tilesizeY: number;
  private readonly data;

  constructor(filename: string, tilesizeX: number, tilesizeY: number) {
    this.filename = filename;

    /*readFile(filename, function(err, assets) {
      if (err !== null) {
        console.log('Error while loading ' + filename + ': ' + err);
      }

      this.assets = assets;
    });*/

    this.tilesizeX = tilesizeX;
    this.tilesizeY = tilesizeY;
  }
}
