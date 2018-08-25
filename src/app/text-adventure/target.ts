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
export class SpawnerState {
  readonly targets: Array<Target>;
  tick: number;

  constructor(tragets: Array<Target>, tick: number) {
    this.targets = tragets;
    this.tick = tick;
  }
}

export class TargetSpawner {
  private readonly do_update: (number) => Target;

  constructor(update: (number) => Target) {
    this.do_update = update;
  }

  update(l: Labyrinth, stateHolder: SpawnerState, hero_pos: Pos): Pos {
    const new_target = this.do_update(stateHolder.tick);

    if (new_target !== undefined) {
      stateHolder.targets.push(new_target);
    }

    for (let i = 0; i < stateHolder.targets.length;) {
      const target = stateHolder.targets[i];
      const dp = target.update();

      target.pos.x += dp.x;
      target.pos.y += dp.y;

      if (target.pos.y >= consts.map_lines || target.pos.y < 0
        || target.pos.x < 0 || target.pos.x >= consts.char_per_line
        || l.get_symbol_at(target.pos) === '#') {
        stateHolder.targets.splice(i, 1);
        continue;
      }

      if (stateHolder.targets[i].pos.equals(hero_pos)) {
        hero_pos.x += dp.x;
        hero_pos.y += dp.y;
      }

      i++;
    }

    stateHolder.tick++;
    return hero_pos;
  }
}
