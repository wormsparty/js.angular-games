export class TextureLoader {
  private loadedTextures = 0;
  private totalTextures = 0;
  private allTexturesLoaded = false;
  private loadedFunction: () => void;
  public isInitialized = false;

  setLoadedFunction(fnc: () => void) {
    this.loadedFunction = fnc;
  }
  load(filename: string): HTMLImageElement {
    this.totalTextures++;

    const texture_loaded = () => {
      this.loadedTextures++;

      if (this.allTexturesLoaded && this.loadedTextures === this.totalTextures) {
        this.isInitialized = true;
        this.loadedFunction();
      }
    };

    const img: HTMLImageElement = new Image();

    img.onload = () => {
      texture_loaded();
    };

    img.src = filename;
    return img;
  }
  waitLoaded() {
    this.allTexturesLoaded = true;

    if (this.totalTextures === this.loadedTextures) {
      this.isInitialized = true;
      this.loadedFunction();
    }
  }
}
