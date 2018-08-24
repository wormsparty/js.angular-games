import {Pos} from './map_logic';

export class Target {
  pos: Pos;
  symbol: string;
  update: (Target) => boolean;

  constructor(pos: Pos, symbol: string, update: (Target) => boolean) {
    this.pos = pos;
    this.symbol = symbol;
    this.update = update;
  }
}

export class TargetSpawner {
  readonly targets: Array<Target>;

  private tick: number;
  private readonly do_update: (number) => Target;

  constructor(update: (number) => Target) {
    this.do_update = update;
    this.tick = 0;
    this.targets = [];
  }

  update(): void {
    const new_target = this.do_update(this.tick);

    if (new_target !== undefined) {
      this.targets.push(new_target);
    }

    for (let i = 0; i < this.targets.length;) {
      if (this.targets[i].update(this.targets[i])) {
        this.targets.splice(i, 1);
        continue;
      }

      i++;
    }
    for (const target of this.targets) {
    }

    this.tick++;
  }
}
