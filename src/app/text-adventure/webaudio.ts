export class WebAudio {
  private readonly context;
  private readonly data;

  constructor() {
    this.context = new AudioContext();

    if (!this.context) {
      return;
    }
  }
  load(file, onload, onfailure) {
      const context = this.context;
      const data = this.data;

      const request = new XMLHttpRequest();
      request.open('GET', file, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        context.decodeAudioData(
          request.response,
          function(buffer) {
            if (!buffer) {
              console.error('error decoding file data: ' + file);
              onfailure();
              return;
            }

            data[file] = buffer;
            onload(file);
          },
          function(error) {
            console.error('decodeAudioData error', error);
            onfailure();
          }
        );
      };

      request.onerror = function() {
        console.error('BufferLoader: XHR error');
        onfailure();
      };

      request.send();
  }
  play(filename) {
      const data = this.data[filename];

      const source = this.context.createBufferSource();
      source.buffer = data;
      source.connect(this.context.destination);
      source.start(0);
  }
}
