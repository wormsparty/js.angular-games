import * as consts from './const';
import {Labyrinth} from './labyrinth';
import {TargetSpawner} from './target';

export class Pos {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(other_pos: Pos): boolean {
    return this.x === other_pos.x && this.y === other_pos.y;
  }

  copy(): Pos {
    return new Pos(this.x, this.y);
  }
}

export class TeleportPos extends Pos {
  id: number;

  constructor(x: number, y: number, id: number) {
    super(x, y);
    this.id = id;
  }
}

export class ObjPos extends Pos {
  x: number;
  y: number;
  usage: number;
  price: number;

  constructor(x: number, y: number, usage: number, price: number) {
    super(x, y);
    this.usage = usage;
    this.price = price;
  }

  copy(): ObjPos {
    return new ObjPos(this.x, this.y, this.usage, this.price);
  }
}

export class ProjPos extends Pos {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  power: number;

  constructor(x: number, y: number, vx: number, vy: number, symbol: string, power: number) {
    super(x, y);
    this.vx = vx;
    this.vy = vy;
    this.symbol = symbol;
    this.power = power;
  }

  copy(): ProjPos {
    return new ProjPos(this.x, this.y, this.vx, this.vy, this.symbol, this.power);
  }
}

export class LevelMap {
  map: string;
  meta: string;
  teleport_map: Map<string, string>;
  tile2color: Map<string, string>;
  texts: Map<string, Pos>;
  teleports: Map<string, Array<TeleportPos>>;
  teleport_count: Map<string, number>;
  initial_pnj_positions: Map<string, Array<Pos>>;
  initial_item_positions: Map<string, Array<ObjPos>>;
  start: Pos;
  background_color: string;
  text_color: string;
  pnj2position: Map<string, (l: Labyrinth, p1: Pos, p2: Pos) => Pos>;
  target_spawner: TargetSpawner;

  constructor(map: string, meta: string, teleport_map: Map<string, string>,
              tile2color: Map<string, string>, texts: Map<string, Pos>, background: string,
              text_color: string, pnj2position: Map<string, (l: Labyrinth, p1: Pos, p2: Pos) => Pos>,
              target_spawner: TargetSpawner) {
    this.map = map;
    this.meta = meta;
    this.teleport_map = teleport_map;
    this.tile2color = tile2color;
    this.texts = texts;
    this.teleports = new Map<string, Array<TeleportPos>>();
    this.teleport_count = new Map<string, number>();
    this.initial_pnj_positions = new Map<string, Array<Pos>>();
    this.initial_item_positions = new Map<string, Array<ObjPos>>();
    this.start = new Pos(0, 0);
    this.pnj2position = pnj2position;
    this.target_spawner = target_spawner;

    if (background !== undefined) {
      this.background_color = background;
    } else {
      this.background_color = consts.DefaultBackgroundColor;
    }

    if (text_color !== undefined) {
      this.text_color = text_color;
    } else {
      this.text_color = consts.DefaultTextColor;
    }
  }

  parse(name: string): void {
    const visual_map: Array<string> = this.map.split('\n');
    const meta_map: Array<string> = this.meta.split('\n');

    if (visual_map.length !== consts.map_lines) {
      console.log('La carte V ' + name + ' n\'a pas exactement ' + consts.map_lines + ' lignes (' + visual_map.length + ')');
    }

    if (meta_map.length !== consts.map_lines) {
      console.log('La carte M ' + name + ' n\'a pas exactement ' + consts.map_lines + ' lignes (' + meta_map.length + ')');
    }

    for (let i = 0; i < consts.map_lines; i++) {
      if (visual_map[i].length !== consts.char_per_line) {
        console.log('V ' + name + ' l.' + i + ' n\'a pas exactement ' + consts.char_per_line + ' chars (' + visual_map[i].length + ')');
      }

      if (meta_map[i].length !== consts.char_per_line) {
        console.log('M ' + name + ' l.' + i + ' n\'a pas exactement ' + consts.char_per_line + ' chars (' + meta_map[i].length + ')');
      }
    }

    for (let y = 0; y < consts.map_lines; y++) {
      for (let x = 0; x < consts.char_per_line; x++) {
        const chr = meta_map[y][x];

        if (chr === '#') {
          if (visual_map[y][x] !== '#') {
            console.log('Les murs ne marchent pas en (' + x + ', ' + y + '), carte = ' + name);
          }
        }  else if (consts.teleport_symbols.indexOf(chr) > -1) {
          if (!this.teleports.has(chr)) {
            this.teleports.set(chr, []);
            this.teleport_count.set(chr, 0);
          }

          this.teleports.get(chr).push(new TeleportPos(x, y, this.teleport_count.get(chr)));
          this.teleport_count.set(chr, this.teleport_count.get(chr) + 1);
        } else if (consts.item_symbols.indexOf(chr) > -1) {
          if (!this.initial_item_positions.has(chr)) {
            this.initial_item_positions.set(chr, []);
          }

          let usage = consts.spell_usage[chr];
          let price = 0;

          if (usage === undefined) {
            usage = 1;
          }

          if (consts.shop_maps.indexOf(name) > -1) {
            price = consts.item2price[chr];
          }

          this.initial_item_positions.get(chr).push(new ObjPos(x, y, usage, price));
        } else if (chr !== ' ' && chr !== undefined) {
          if (chr === '@') {
            this.start = new Pos(x, y);
          } else {
            if (!this.initial_pnj_positions.has(chr)) {
              this.initial_pnj_positions.set(chr, []);
            }

            this.initial_pnj_positions.get(chr).push(new Pos(x, y));
          }
        }
      }
    }
  }
  get_symbol_at(x: number, y: number): string {
    return this.map[y * (consts.char_per_line + 1) + x];
  }
}
