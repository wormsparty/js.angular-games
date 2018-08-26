import {Pos} from './map_logic';
import {Labyrinth} from './labyrinth';
import * as consts from './const';
import * as translations from './translations';

export class Target {
  pos: Pos;
  symbol: string;
  pv: number;
  pv_max: number;

  constructor(pos: Pos, symbol: string, pv: number, pv_max: number) {
    this.pos = pos;
    this.symbol = symbol;
    this.pv = pv;
    this.pv_max = pv_max;
  }

  copy(): Target {
    return new Target(this.pos.copy(), this.symbol, this.pv, this.pv_max);
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
      p.targets.push(new Target(new Pos(target.pos.x, target.pos.y), target.symbol, target.pv, target.pv_max));
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
        pv: this.targets[i].pv,
        pv_max: this.targets[i].pv_max,
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
  reset(): void {
    this.tick = 0;
    this.targets.splice(0, this.targets.length);
  }
}

export class TargetSpawner {
  private readonly spawner_update: (SpawnerState) => void;
  private readonly target_update: () => Pos;
  pv2color: (number) => string;

  constructor(spawner_update: (SpawnerState) => void, target_update: () => Pos, pv2color: (number) => string) {
    this.spawner_update = spawner_update;
    this.target_update = target_update;
    this.pv2color = pv2color;
  }

  inner_update(l: Labyrinth, i: number, target: Target, stateHolder: SpawnerState, hero_pos: Pos, dp: Pos): [boolean, Pos] {
    const [hit, power] = l.hits_projectile(target.pos);
    const lang = l.personal_info.lang;

    if (hit !== -1) {
      l.projectile2item(l.current_map_data, target.pos, hit);
      target.pv -= power;

      if (target.pv <= 0) {
        stateHolder.targets.splice(i, 1);
        return [ false, null ];
      }
    }

    if (target.pos.equals(hero_pos)) {
      if (target.symbol === 'O') {
        // TODO: Check for teleports here??
        hero_pos.x += dp.x;
        hero_pos.y += dp.y;
      } else {
        l.game_over_message = translations.symbol2gameover[lang][target.symbol];
        return [ true, hero_pos ];
      }
    }

    return [ true, null ];
  }
  update(l: Labyrinth, stateHolder: SpawnerState, hero_pos: Pos): Pos {
    this.spawner_update(stateHolder);

    for (let i = 0; i < stateHolder.targets.length;) {
      const target = stateHolder.targets[i];
      const dp = this.target_update();

      // We need to make the test twice (see below).
      // This case is if the projectile hits directly
      // The case below is if the two are separated by 1:
      // the target gets at the same position as the projectile
      // -> It needs to count as a hit too
      let [cont, new_pos] = this.inner_update(l, i, target, stateHolder, hero_pos, dp);

      if (!cont) {
        continue;
      }

      if (new_pos !== null) {
        return new_pos;
      }

      target.pos.x += dp.x;
      target.pos.y += dp.y;

      if (target.pos.y >= consts.map_lines || target.pos.y < 0
        || target.pos.x < 0 || target.pos.x >= consts.char_per_line
        || l.get_symbol_at(target.pos) === '#') {
        stateHolder.targets.splice(i, 1);
        continue;
      }

      [cont, new_pos] = this.inner_update(l, i, target, stateHolder, hero_pos, dp);

      if (!cont) {
        continue;
      }

      if (new_pos !== null) {
        return new_pos;
      }

      i++;
    }

    stateHolder.tick++;
    return hero_pos;
  }
}
