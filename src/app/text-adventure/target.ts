import {Pos} from './map_logic';
import {Labyrinth} from './labyrinth';
import * as consts from './const';

export class Target {
  pos: Pos;
  symbol: string;

  constructor(pos: Pos, symbol: string) {
    this.pos = pos;
    this.symbol = symbol;
  }

  copy(): Target {
    return new Target(this.pos.copy(), this.symbol);
  }
}

export class SpawnerState {
  readonly targets: Array<Target>;
  tick: number;

  constructor(targets: Array<Target>, tick: number) {
    this.targets = targets;
    this.tick = tick;
  }

  static parse(json: any): SpawnerState {
    if (json === null) {
      return null;
    }

    const p = new SpawnerState([], json.tick);

    for (let i = 0; i < json.targets.length; i++) {
      const target = json.targets[i];
      p.targets.push(new Target(new Pos(target.pos.x, target.pos.y), target.symbol));
    }

    return p;
  }
  print(): {} {
    const json = {
      targets: [],
      tick: this.tick,
    };

    for (let i = 0; i < this.targets.length; i++) {
      json.targets[i] = {
        pos: {
          x: this.targets[i].pos.x,
          y: this.targets[i].pos.y,
        },
        symbol: this.targets[i].symbol,
      };
    }

    return json;
  }
  copy(): SpawnerState {
    const cpy = new SpawnerState([], this.tick);

    for (const t of this.targets) {
      cpy.targets.push(t.copy());
    }

    return cpy;
  }
}

export class TargetSpawner {
  private readonly spawner_update: (number) => Target;
  private target_update: () => Pos;

  constructor(spawner_update: (number) => Target, target_update: () => Pos) {
    this.spawner_update = spawner_update;
    this.target_update = target_update;
  }

  update(l: Labyrinth, stateHolder: SpawnerState, hero_pos: Pos): Pos {
    const new_target = this.spawner_update(stateHolder.tick);

    if (new_target !== undefined) {
      stateHolder.targets.push(new_target);
    }

    for (let i = 0; i < stateHolder.targets.length;) {
      const target = stateHolder.targets[i];
      const dp = this.target_update();

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
