import {Pos} from './map_logic';
import {Labyrinth} from './labyrinth';
import * as consts from './const';

export class Target {
  pos: Pos;
  symbol: string;
  update: () => Pos;

  constructor(pos: Pos, symbol: string, update: () => Pos) {
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

  update(l: Labyrinth, hero_pos: Pos): Pos {
    const new_target = this.do_update(this.tick);

    if (new_target !== undefined) {
      this.targets.push(new_target);
    }

    for (let i = 0; i < this.targets.length;) {
      const target = this.targets[i];
      const dp = target.update();

      target.pos.x += dp.x;
      target.pos.y += dp.y;

      if (target.pos.y >= consts.map_lines || target.pos.y < 0
        || target.pos.x < 0 || target.pos.x >= consts.char_per_line
        || l.get_symbol_at(target.pos) === '#') {
        this.targets.splice(i, 1);
        continue;
      }

      if (this.targets[i].pos.equals(hero_pos)) {
        hero_pos.x += dp.x;
        hero_pos.y += dp.y;
      }

      i++;
    }

    this.tick++;
    return hero_pos;
  }
}
