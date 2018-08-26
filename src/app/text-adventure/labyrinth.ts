import {Engine} from './engine';
import {AllMaps} from './map_content';
import * as consts from './const';
import * as translations from './translations';
import {LevelMap, Pos, ObjPos, ProjPos} from './map_logic';
import {item2color} from './const';
import {SpawnerState} from './target';

function get_random_mouvement(pnj): Pos {
  const new_pnj = new Pos(pnj.x, pnj.y);
  const r = Math.floor(Math.random() * 16);
  const mouvement = consts.mouvement_map[r];

  if (mouvement !== undefined) {
    new_pnj.x += mouvement.x;
    new_pnj.y += mouvement.y;
  }

  return new_pnj;
}

function make_first_letter_upper(str): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

const charToCommand = new Map<string, Pos>([
  [ '7', new Pos(consts.char_per_line - 11, 0) ],
  [ '8', new Pos(consts.char_per_line - 8, 0) ],
  [ '9', new Pos(consts.char_per_line - 5, 0) ],
  [ '4', new Pos(consts.char_per_line - 11, 1) ],
  [ '5', new Pos(consts.char_per_line - 8, 1) ],
  [ '6', new Pos(consts.char_per_line - 5, 1) ],
  [ '1', new Pos(consts.char_per_line - 11, 2) ],
  [ '2', new Pos(consts.char_per_line - 8, 2) ],
  [ '3', new Pos(consts.char_per_line - 5, 2) ],
]);

const currencyFormatter = new Intl.NumberFormat('fr-CH', {
  style: 'decimal',
  minimumFractionDigits: 0,
});

class Item {
  symbol: string;
  usage: number;

  constructor(symbol, usage) {
    this.symbol = symbol;
    this.usage = usage;
  }
}

class PersistedMapData {
  pnjs: Map<string, Pos>;
  items: Map<string, Array<ObjPos>>;
  projectiles: Array<ProjPos>;
  spawner: SpawnerState;

  static parse(json): PersistedMapData {
    if (json === null) {
      return null;
    }

    const p = new PersistedMapData();

    p.pnjs = new Map<string, Pos>();

    for (const pnj in json.pnjs) {
      if (json.pnjs.hasOwnProperty(pnj)) {
        p.pnjs.set(pnj, new Pos(json.pnjs[pnj].x, json.pnjs[pnj].y));
      }
    }

    p.items = new Map<string, Array<ObjPos>>();

    for (const item in json.items) {
      if (json.items.hasOwnProperty(item)) {
        const pss: Array<ObjPos> = [];
        const positions = json.items[item];

        for (let i = 0; i < positions.length; i++) {
          pss.push(new ObjPos(positions[i].x, positions[i].y, positions[i].usage, positions[i].price));
        }

        p.items.set(item, pss);
      }
    }

    p.projectiles = [];

    for (let i = 0 ; i < json.projectiles.length; i++) {
      const proj = json.projectiles[i];
      p.projectiles.push(new ProjPos(proj.x, proj.y, proj.vx, proj.vy, proj.symbol, proj.power));
    }

    p.spawner = SpawnerState.parse(json.spawner);
    return p;
  }
  print(): {} {
    const p = {
      pnjs: {},
      items: {},
      projectiles: [],
      spawner: this.spawner.print(),
    };

    for (const [pnj, position] of this.pnjs) {
      p.pnjs[pnj] = {
        x: position.x,
        y: position.y,
      };
    }

    for (const [item, positions] of this.items) {
      const pss = [];

      for (let i = 0; i < positions.length; i++) {
        pss.push({
          x: positions[i].x,
          y: positions[i].y,
          usage: positions[i].usage,
          price: positions[i].price,
        });
      }

      p.items[item] = pss;
    }

    for (const proj of this.projectiles) {
      p.projectiles.push({
        x: proj.x,
        y: proj.y,
        vx: proj.vx,
        vy: proj.vy,
        symbol: proj.symbol,
        power: proj.power,
      });
    }

    return p;
  }
  copy(): PersistedMapData {
    const cpy = new PersistedMapData();

    cpy.pnjs = new Map<string, Pos>();

    for (const [pnj, position] of this.pnjs) {
      cpy.pnjs.set(pnj, position.copy());
    }

    cpy.items = new Map<string, Array<ObjPos>>();

    for (const [item, positions] of this.items) {
      const pss: Array<ObjPos> = [];

      for (const p of positions) {
        pss.push(p.copy());
      }

      cpy.items.set(item, pss);
    }

    cpy.projectiles = [];

    for (const proj of this.projectiles) {
      cpy.projectiles.push(proj.copy());
    }

    cpy.spawner = this.spawner.copy();
    return cpy;
  }
}

class PersistedData {
  slots: Array<Item>;
  coins: number;
  hero_position: Pos;
  map_data: Map<string, PersistedMapData>;
  current_map_name: string;

  static parse(json): PersistedData {
    if (json === null) {
      return null;
    }

    const p = new PersistedData();

    p.slots = new Array<Item>(json.slots.length);

    for (let i = 0; i < json.slots.length; i++) {
      p.slots[i] = new Item(json.slots[i].symbol, json.slots[i].usage);
    }

    p.coins = json.coins;
    p.hero_position = new Pos(json.hero_position.x, json.hero_position.y);
    p.map_data = new Map<string, PersistedMapData>();

    for (const map in json.map_data) {
      if (json.map_data.hasOwnProperty(map)) {
        p.map_data.set(map, PersistedMapData.parse(json.map_data[map]));
      }
    }

    p.current_map_name = json.current_map_name;
    return p;
  }
  print(): {} {
    const p = {
      slots: [],
      coins: this.coins,
      hero_position: {
        x: this.hero_position.x,
        y: this.hero_position.y
      },
      map_data: {},
      current_map_name: this.current_map_name,
    };

    for (let i = 0; i < this.slots.length; i++) {
      p.slots[i] = {
        symbol: this.slots[i].symbol,
        usage: this.slots[i].usage,
      };
    }

    for (const [i, data] of this.map_data) {
      p.map_data[i] = data.print();
    }

    return p;
  }
  copy(): PersistedData {
    const cpy = new PersistedData();

    cpy.slots = new Array<Item>(this.slots.length);

    for (let i = 0; i < this.slots.length; i++) {
      cpy.slots[i] = new Item(this.slots[i].symbol, this.slots[i].usage);
    }

    cpy.coins = this.coins;
    cpy.hero_position = this.hero_position.copy();

    cpy.map_data = new Map<string, PersistedMapData>();

    for (const [name, data] of this.map_data) {
      cpy.map_data.set(name, data.copy());
    }

    cpy.current_map_name = this.current_map_name;
    return cpy;
  }
}

class PersonalInfos {
  lang: string;
  // visa?
}

export class Labyrinth {
  public pressed: Map<string, boolean>;
  private readonly engine: Engine;
  readonly char_width: number;
  private current_status: string;
  private selected_slot: number;
  private action: string;
  private is_menu_open: boolean;
  private is_main_menu: boolean;
  private menu_position: number;
  private main_menu: Array<any>;
  private game_menu: Array<any>;

  game_over_message: string;
  personal_info: PersonalInfos;
  last_save: PersistedData;
  persisted_data: PersistedData;
  initial_persisted_data: PersistedData;

  current_map: LevelMap;
  current_map_data: PersistedMapData;

  static load_save(l: Labyrinth, save: PersistedData) {
    l.persisted_data = save;

    l.is_main_menu = false;
    l.is_menu_open = false;

    l.change_map(l.persisted_data.current_map_name);
    l.is_menu_open = false;

    l.save_to_memory();
  }
  static load_from_storage(l: Labyrinth): void {
    Labyrinth.load_save(l, Labyrinth.get_from_storage());
  }
  static save_to_storage(l: Labyrinth): void {
    const save_data = JSON.stringify(l.persisted_data.print());
    window.localStorage.setItem('save', save_data);
    l.is_menu_open = false;
  }
/*  static clear_storage() {
    window.localStorage.clear();
  }*/
  static get_from_storage(): PersistedData {
    const save_data = window.localStorage.getItem('save');

    if (save_data === undefined) {
      return null;
    }

    const persisted_data = PersistedData.parse(JSON.parse(save_data));

    if (persisted_data === null) {
      return null;
    }

    return persisted_data;
  }
  static toggle_language(l: Labyrinth): void {
    if (l.personal_info.lang === 'en') {
      l.personal_info.lang = 'fr';
    } else {
      l.personal_info.lang = 'en';
    }

    l.save_personal_infos();
    l.refresh_menu(false);
    l.draw();
  }
  static open_main_menu(l: Labyrinth) {
    l.refresh_menu(true);
    l.is_main_menu = true;
  }
  static clear_and_start(l: Labyrinth): void {
    Labyrinth.load_save(l, l.initial_persisted_data.copy());

    // We can override default values for debugging here
    // l.persisted_data.slots[0] = new Item('/', -1);
    // l.persisted_data.slots[1] = new Item('=', consts.spell_usage['=']);
    // l.persisted_data.slots[2] = new Item('*', 10);
  }
  parse_all_maps(): void {
    this.initial_persisted_data = new PersistedData();
    this.initial_persisted_data.map_data = new Map<string, PersistedMapData>();

    for (const [key, map] of AllMaps) {
      map.parse(key); // TODO: Pourquoi map.parse est détectée comme non utilisée??

      const map_data = new PersistedMapData();
      map_data.items = new Map<string, Array<ObjPos>>();
      map_data.pnjs = new Map<string, Pos>();
      map_data.projectiles = [];
      map_data.spawner = new SpawnerState([], 0);

      //
      // If new fresh state
      //
      for (const [pnj, positions] of map.initial_pnj_positions) {
        map_data.pnjs.set(pnj, positions[Math.floor(Math.random() * positions.length)].copy());
      }

      for (const [item, positions] of map.initial_item_positions) {
        const item_positions: Array<ObjPos> = [];

        for (let i = 0; i < positions.length; i++) {
          item_positions.push(positions[i].copy());
        }

        map_data.items.set(item, item_positions);
      }

      this.initial_persisted_data.map_data.set(key, map_data);
    }

    this.initial_persisted_data.coins = 0;
    this.initial_persisted_data.slots = new Array<Item>(3);
    this.initial_persisted_data.slots[0] = new Item('', -1);
    this.initial_persisted_data.slots[1] = new Item('', -1);
    this.initial_persisted_data.slots[2] = new Item('', -1);

    const initial_map = 'bateau';
    this.initial_persisted_data.current_map_name = initial_map;
    this.initial_persisted_data.hero_position = AllMaps.get(initial_map).start;
  }
  draw(): void {
    if (this.is_main_menu) {
      this.engine.clear(consts.DefaultBackgroundColor);
      this.draw_main_menu();
    } else {
      this.engine.clear(this.current_map.background_color);
      this.draw_all();
    }
  }
  do_update(): void {
    if (this.is_menu_open || this.is_main_menu) {
      this.update_menu();
    } else {
      this.update_on_map();
    }
  }
  get_string_from(x, y, length): string {
    return this.current_map.map.substr(y * (consts.char_per_line + 1) + x, length);
  }
  to_screen_coord(x, y, dx = 0, dy = 0): Pos {
    return new Pos(this.char_width * x + dx, 16 * y + dy);
  }
  update_current_status(hero_pos): void {
    let status_set = false;
    let current_status = this.current_status;
    const lang = this.personal_info.lang;

    for (const [item, positions] of this.current_map_data.items) {
      for (let i = 0 ; i < positions.length; i++) {
        if (positions[i].equals(hero_pos)) {
          if (item === '$') {
            this.persisted_data.coins++;
            positions.splice(i, 1);
            current_status = '> 1 $' + translations.pris[lang]['M'];
          } else {
            const description = translations.item2description[lang][item];

            if (positions[i].price > 0) {
              current_status = translations.buy[lang] + description.text + ' (' + consts.item2price[item] + '.-)';
            } else {
              current_status = translations.take[lang] + description.text;

              if (positions[i].usage > 1) {
                current_status += ' (x' + positions[i].usage + ')';
              }
            }
          }

          status_set = true;
          break;
        }
      }

      if (status_set) {
        break;
      }
    }

    if (!status_set) {
      this.current_status = '';
    } else {
      this.current_status = current_status;
    }
  }
  drop_current_slot_item_at(pos: Pos) {
    // Drop item on the ground if any
    const selected_slot = this.persisted_data.slots[this.selected_slot];

    if (selected_slot.symbol !== '') {
      if (!this.current_map_data.items.has(selected_slot.symbol)) {
        this.current_map_data.items.set(selected_slot.symbol, []);
      }

      this.current_map_data.items.get(selected_slot.symbol).push(new ObjPos(pos.x, pos.y, selected_slot.usage, 0));
    }
  }
  try_pick_or_drop_item(hero_pos): boolean {
    const lang = this.personal_info.lang;

    if (this.pressed.get('q')) {
      const selected_slot = this.persisted_data.slots[this.selected_slot];

      if (selected_slot.symbol === '') {
        this.current_status = '> Il n\'y a rien à déposer';
        return true;
      }

      for (const [item, positions] of this.current_map_data.items) {
        for (let i = 0; i < positions.length; i++) {
          if (positions[i].equals(hero_pos)) {
            this.current_status = '> Il y a déjà un objet ici';
            return true;
          }
        }
      }

      const current_symbol = this.get_symbol_at(hero_pos);

      if (current_symbol === '>' || current_symbol === '<') {
        this.current_status = '> Pas sur un escalier';
        return true;
      }

      const desc = translations.item2description[lang][selected_slot.symbol];
      this.current_status = '> ' + make_first_letter_upper(desc.text) + translations.depose[lang][desc.genre];

      this.drop_current_slot_item_at(hero_pos);

      selected_slot.symbol = '';
      selected_slot.usage = -1;
      this.action = '';

      return true;
    }

    if (this.pressed.get('5')) {
      let item_picked = false;
      let coins = this.persisted_data.coins;
      let current_status = this.current_status;

      for (const [item, positions] of this.current_map_data.items) {
        const description = translations.item2description[lang][item];

        for (let i = 0 ; i < positions.length; i++) {
          if (positions[i].equals(hero_pos)) {
            const price = positions[i].price;

            if (coins >= price) {
              // Take the item to weapon slot
              let found_slot = false;

              if (consts.throwable_items.indexOf(item) > -1) {
                for (let j = 0; j < 3 ; j++) {
                  const slt = this.persisted_data.slots[j];

                  if (slt.symbol === item) {
                    slt.usage += positions[i].usage;
                    found_slot = true;
                    break;
                  } else if (slt.symbol === '') {
                    slt.symbol = item;
                    slt.usage = positions[i].usage;
                    found_slot = true;
                    break;
                  }
                }
              }

              if (!found_slot) {
                this.drop_current_slot_item_at(positions[i]);
                this.persisted_data.slots[this.selected_slot].symbol = item;
                this.persisted_data.slots[this.selected_slot].usage = positions[i].usage;
              }

              const upper = make_first_letter_upper(description.text);

              if (price > 0) {
                coins -= price;
                current_status = '> ' + upper + translations.achete[lang][description.genre] + price + '.-';
              } else {
                current_status = '> ' + upper;

                if (positions[i].usage > 1) {
                  current_status += ' (x' + positions[i].usage + ')';
                }

                current_status += translations.pris[lang][description.genre];
              }

              positions.splice(i, 1);
            } else {
              current_status = translations.not_enough[lang];
            }

            item_picked = true;
            break;
          }
        }

        if (item_picked) {
          break;
        }
      }

      if (!item_picked) {
        this.current_status = '';
      } else {
        this.persisted_data.coins = coins;
        this.current_status = current_status;
      }

      return true;
    }

    return false;
  }
  try_enter_or_exit(hero_pos): [boolean, Pos, string] {
    const symbol = this.get_symbol_at(hero_pos);

    if (symbol !== '>' && symbol !== '<') {
      return [false, undefined, undefined];
    }

    return this.do_teleport(symbol, hero_pos, hero_pos, hero_pos);
  }
  try_talk(future_pos: Pos): boolean {
    const lang = this.personal_info.lang;

    for (const [pnj, pnj_pos] of this.current_map_data.pnjs) {
      if (pnj_pos.equals(future_pos)) {
        this.current_status = translations.pnj2dialog[lang][pnj];
        return true;
      }
    }

    return false;
  }
  move_pnjs(future_pos): void {
    for (const [p, pnj] of this.current_map_data.pnjs) {
      if (this.current_map.pnj2position !== undefined && this.current_map.pnj2position.has(p)) {
        this.current_map_data.pnjs.set(p, this.current_map.pnj2position.get(p)(this, pnj, future_pos));
      } else {
        const new_pnj = get_random_mouvement(pnj);

        if (!new_pnj.equals(future_pos)
          && consts.walkable_symbols.indexOf(this.get_symbol_at(new_pnj)) > -1) {
          this.current_map_data.pnjs.set(p, new_pnj);
        }
      }
    }
  }
  move_hero(hero_pos: Pos, walkable_pos: Pos, aim_pos: Pos): Pos {
    const ret = this.try_teleport(hero_pos, walkable_pos);
    const lang = this.personal_info.lang;

    if (ret[0]) {
      this.change_map(ret[2]);
      hero_pos = ret[1];
      this.persisted_data.hero_position = ret[1];
      this.save_to_memory();
    } else {
      const [evt, symbol] = this.try_hit_target(hero_pos, aim_pos);

      if (evt === '') {
        hero_pos = walkable_pos;
        this.update_current_status(hero_pos);
      } else if (evt === 'hit') {
        this.current_status = translations.hit[lang][symbol];
      }
    }

    return hero_pos;
  }
  // We get:
  // (1) The walkable future position,
  // (2) The real future direction (for aiming) and
  // (3) the new status, if we hit something
  get_future_position(hero_pos): [Pos, Pos, string] {
    let x = hero_pos.x;
    let y = hero_pos.y;

    if (this.pressed.get('1') || this.pressed.get('2') || this.pressed.get('3')) {
      y++;
    }

    if (this.pressed.get('7') || this.pressed.get('8') || this.pressed.get('9')) {
      y--;
    }

    if (this.pressed.get('1') || this.pressed.get('4') || this.pressed.get('7')) {
      x--;
    }

    if (this.pressed.get('3') || this.pressed.get('6') || this.pressed.get('9')) {
      x++;
    }

    const future_pos: Pos = new Pos(x, y);
    const allowed_walking_symbols = consts.walkable_symbols;
    const lang = this.personal_info.lang;

    let symbol = this.get_symbol_at(future_pos);

    if (allowed_walking_symbols.indexOf(symbol) > -1) {
      return [future_pos, future_pos, ''];
    }

    if (hero_pos.y !== future_pos.y) {
      symbol = this.current_map.get_symbol_at(hero_pos.x, future_pos.y);

      if (allowed_walking_symbols.indexOf(symbol) > -1) {
        return [new Pos(hero_pos.x, future_pos.y), future_pos, ''];
      } else {
        if (future_pos.x !== hero_pos.x) {
          symbol = this.current_map.get_symbol_at(future_pos.x, hero_pos.y);
        }

        if (allowed_walking_symbols.indexOf(symbol) > -1) {
          return [new Pos(future_pos.x, hero_pos.y), future_pos, ''];
        } else {
          return [hero_pos, future_pos, ''];
        }
      }
    } else {
      symbol = this.current_map.get_symbol_at(future_pos.x, hero_pos.y);

      if (allowed_walking_symbols.indexOf(symbol) > -1) {
        return [new Pos(future_pos.x, hero_pos.y), future_pos, ''];
      } else {
        return [ hero_pos, future_pos, '' ];
      }
    }
  }
  change_map(map_name: string): void {
    this.current_map = AllMaps.get(map_name);
    this.persisted_data.current_map_name = map_name;
    this.current_map_data = this.persisted_data.map_data.get(map_name);
  }
  save_to_memory(): void {
    this.last_save = this.persisted_data.copy();
  }
  load_last_save() {
    this.persisted_data = this.last_save.copy();
    this.change_map(this.persisted_data.current_map_name);
  }
  try_teleport(hero_pos, future_pos): [boolean, Pos, string] {
    for (const [chr, teleports_for_char] of this.current_map.teleports) {
      if (chr === '<' || chr === '>') { // These are treated separately
        continue;
      }

      for (let j = 0; j < teleports_for_char.length; j++) {
        const pos = teleports_for_char[j];

        if (pos.equals(future_pos)) {
          return this.do_teleport(chr, pos, hero_pos, future_pos);
        }
      }
    }

    return [
      false,
      undefined,
      undefined,
    ];
  }
  do_teleport(chr, pos, hero_pos, future_pos): [boolean, Pos, string] {
    const new_map_name = this.current_map.teleport_map.get(chr);
    const new_map = AllMaps.get(new_map_name);
    let teleports_of_other_map;
    let id;

    if (chr === '>') {
      teleports_of_other_map = new_map.teleports.get('<');
      id = 0;
    } else if (chr === '<') {
      teleports_of_other_map = new_map.teleports.get('>');
      id = 0;
    } else {
      teleports_of_other_map = new_map.teleports.get(chr);
      id = pos.id;
    }

    const tp = teleports_of_other_map[id];

    let new_x = tp.x + (future_pos.x - hero_pos.x);
    let new_y = tp.y + (future_pos.y - hero_pos.y);

    // Fix the case where teleport + mouvement ends up in a wall!
    if (new_map.get_symbol_at(new_x, new_y) === '#') {
      if (new_map.get_symbol_at(tp.x, new_y) === '#') {
        new_y = tp.y;
      } else {
        new_x = tp.x;
      }
    }

    return [
      true,
      new Pos(new_x, new_y),
      new_map_name,
    ];
  }
  try_hit_target(hero_pos: Pos, aim_pos: Pos): [string, string] {
    if (this.current_map.target_spawner === undefined) {
      return [ '', '' ];
    }

    const targets = this.current_map_data.spawner.targets;

    for (let i = 0; i < targets.length;) {
      const target = targets[i];

      if (target.pos.equals(aim_pos)) {
        if (this.has_weapon_equiped()) {
          target.pv--;

          if (target.pv <= 0) {
            targets.splice(i, 1);
            return [ 'hit', target.symbol ];
          } else {
            return [ 'push', target.symbol ];
          }
        } else {
          return [ 'push', target.symbol ];
        }
      }

      i++;
    }

    return [ '', '' ];
  }
  update_targets(hero_pos: Pos): Pos {
    if (this.current_map.target_spawner !== undefined) {
      return this.current_map.target_spawner.update(this, this.current_map_data.spawner, hero_pos);
    }

    return hero_pos;
  }
  move_projectiles() {
    for (let i = 0; i < this.current_map_data.projectiles.length;) {
      const proj = this.current_map_data.projectiles[i];

      const newprojx = proj.x + proj.vx;
      const newprojy = proj.y + proj.vy;

      if (newprojy >= consts.map_lines || newprojy < 0
        || newprojx < 0 || newprojx >= consts.char_per_line
        || consts.walkable_symbols.indexOf(this.current_map.get_symbol_at(newprojx, newprojy)) === -1) {
        this.projectile2item(i);
        continue;
      }

      proj.x = newprojx;
      proj.y = newprojy;

      i++;
    }
  }
  move_targets_or_die(hero_pos: Pos) {
    hero_pos = this.update_targets(hero_pos);
    const lang = this.personal_info.lang;
    const symbol = this.get_symbol_at(hero_pos);

    if (consts.walkable_symbols.indexOf(symbol) === -1) {
      this.game_over_message = translations.symbol2gameover[lang][symbol];
    } else {
      this.persisted_data.hero_position = hero_pos;
    }

  }
  update_menu() {
    let current_menu: Array<any>;

    if (this.is_main_menu) {
      current_menu = this.main_menu;
    } else {
      current_menu = this.game_menu;
    }

    if (this.pressed.get('8')) {
      let new_p = this.menu_position;

      if (new_p > 0) {
        do {
          new_p--;
        }
        while (new_p !== -1 && !current_menu[new_p][2]);
      }

      if (new_p !== -1) {
        this.menu_position = new_p;
      }
    }

    if (this.pressed.get('2')) {
      let new_p = this.menu_position;

      if (new_p < current_menu.length) {
        do {
          new_p++;
        }
        while (new_p !== current_menu.length && !current_menu[new_p][2]);
      }

      if (new_p !== current_menu.length) {
        this.menu_position = new_p;
      }
    }

    if (this.pressed.get('5')) {
      current_menu[this.menu_position][1](this);
    }

    if (!this.is_main_menu && this.pressed.get('Escape')) {
      this.is_menu_open = false;
    }
  }
  update_on_map() {
    if (this.game_over_message !== '') {
      if (this.pressed.get(' ')) {
        this.game_over_message = '';
        this.load_last_save();
      }

      return;
    }

    if (this.pressed.get('a')) {
      this.selected_slot = 0;
      this.action = '';
      return;
    }

    if (this.pressed.get('s')) {
      this.selected_slot = 1;
      this.action = '';
      return;
    }

    if (this.pressed.get('d')) {
      this.selected_slot = 2;
      this.action = '';
      return;
    }

    if (this.pressed.get('Shift') && this.has_throwable_item_on_slot(this.selected_slot)) {
      if (this.action !== 'throw') {
        this.action = 'throw';
      } else {
        this.action = '';
      }

      return;
    }

    if (this.pressed.get('Escape')) {
      this.is_menu_open = true;
      this.menu_position = 0;
      this.refresh_menu(false); // This is to update the availability of Load()
      return;
    }

    const selected_slot = this.persisted_data.slots[this.selected_slot];

    if (this.pressed.get(' ') && this.has_usable_item_on_slot(this.selected_slot)) {
      if (this.action !== 'use') {
        this.action = 'use';
      } else {
        this.action = '';
      }

      this.move_projectiles();
      this.move_targets_or_die(this.persisted_data.hero_position);
      return;
    }

    const future_pos = this.get_future_position(this.persisted_data.hero_position);
    const lang = this.personal_info.lang;

    const ret = this.try_enter_or_exit(future_pos[0]);

    if (ret !== undefined) {
      if (ret[0]) {
        this.change_map(ret[2]);
        this.persisted_data.hero_position = ret[1];
        this.save_to_memory();
        return;
      }
    }

    if (this.try_pick_or_drop_item(this.persisted_data.hero_position)) {
      this.move_projectiles();
      this.move_targets_or_die(this.persisted_data.hero_position);
      return;
    }

    if (this.action === 'use') {
      if (this.has_spell_on_slot(this.selected_slot)) {
        if (selected_slot.usage > 0) {
          // TODO: TRANSLATE
          this.current_status = '> TODO: Lancer sort';
          selected_slot.usage--;
        } else {
          this.current_status = translations.epuise[lang];
        }

        this.action = '';
        this.move_projectiles();
        this.move_targets_or_die(this.persisted_data.hero_position);
        return;
      }
    }

    if (this.action === 'throw') {
      if (this.has_weapon_on_slot(this.selected_slot)) {
        // TODO: TRANSLATE
        this.current_status = '> TODO: Lancer arme';
        selected_slot.symbol = '';
        selected_slot.usage = -1;
        this.action = '';
        this.move_projectiles();
        this.move_targets_or_die(this.persisted_data.hero_position);
        return;
      }

      if (this.has_throwable_on_slot(this.selected_slot)) {
        const item = translations.item2description[lang][this.persisted_data.slots[this.selected_slot].symbol];

        this.current_status = '> ' + make_first_letter_upper(item.text + translations.lance[lang][item.genre]);

        // TODO: REFACTOR
        const x = this.persisted_data.hero_position.x;
        const y = this.persisted_data.hero_position.y;
        const vx = future_pos[1].x - x;
        const vy = future_pos[1].y - y;

        this.current_map_data.projectiles.push(new ProjPos(x, y, vx, vy, '*', 1));
        selected_slot.usage--;

        if (selected_slot.usage <= 0) {
          selected_slot.symbol = '';
          selected_slot.usage = -1;
        }

        this.action = '';
        this.move_projectiles();
        this.move_targets_or_die(this.persisted_data.hero_position);
        return;
      }
    }

    if (future_pos[2] !== '') {
      this.current_status = future_pos[2];
      this.move_projectiles();
      this.move_targets_or_die(this.persisted_data.hero_position);
      return;
    }

    if (this.try_talk(future_pos[0])) {
      return;
    }

    this.persisted_data.hero_position = this.move_hero(this.persisted_data.hero_position, future_pos[0], future_pos[1]);
    this.move_pnjs(this.persisted_data.hero_position);
    this.move_projectiles();
    this.move_targets_or_die(this.persisted_data.hero_position);
  }
  draw_map() {
    for (let y = 0; y < consts.map_lines; y++) {
      for (let x = 0; x < consts.char_per_line;) {
        let length = 0;
        const val = this.current_map.get_symbol_at(x, y);

        if (val === ' ' || val === '\n' || val === undefined) {
          x++;
          continue;
        }

        while (true) {
          length++;

          const chr = this.current_map.get_symbol_at(x + length, y);

          if (chr !== val) {
            break;
          }
        }

        const coord = this.to_screen_coord(x, y + consts.header_size);
        const str = this.get_string_from(x, y, length);
        let color;

        if (this.current_map.tile2color !== undefined) {
          color = this.current_map.tile2color.get(val);
        }

        if (color === undefined) {
          color = consts.globalTile2color[val];
        }

        if (color === undefined) {
          color = this.current_map.text_color;
        }

        this.engine.rect(coord, str.length * this.char_width, 16, this.current_map.background_color);
        this.engine.text(str, coord, color);
        x += length;
      }
    }

    if (this.current_map.texts !== undefined) {
      const lang = this.personal_info.lang;
      const texts = this.current_map.texts[lang];

      for (const key in texts) {
        if (texts.hasOwnProperty(key)) {
          const pos = texts[key];
          this.engine.text(key, this.to_screen_coord(pos.x, pos.y), this.current_map.text_color);
        }
      }
    }
  }
  draw_projectiles() {
    for (const proj of this.current_map_data.projectiles) {
      const coord = this.to_screen_coord(proj.x, proj.y + consts.header_size);

      this.engine.rect(coord, this.char_width, 16, this.current_map.background_color);
      this.engine.text(proj.symbol, coord, consts.projectile2color[proj.symbol]);
    }
  }
  draw_targets() {
    if (this.current_map.target_spawner !== undefined) {
      for (const target of this.current_map_data.spawner.targets) {
        const coord = this.to_screen_coord(target.pos.x, target.pos.y + consts.header_size);

        this.engine.rect(coord, this.char_width, 16, this.current_map.background_color);
        this.engine.text(target.symbol, coord, this.current_map.target_spawner.pv2color(target.pv));
      }
    }
  }
  draw_character(chr: string, coord: Pos, color: string) {
    this.engine.rect(coord, this.char_width, 16, this.current_map.background_color);
    this.engine.text(chr, coord, color);
  }
  draw_pnjs() {
    for (const [p, pnj] of this.current_map_data.pnjs) {
      const coord = this.to_screen_coord(pnj.x, pnj.y + consts.header_size);
      const color = consts.pnj2color[p];

      this.draw_character(p, coord, color);
    }

    this.draw_character('@',
      this.to_screen_coord(this.persisted_data.hero_position.x, this.persisted_data.hero_position.y + consts.header_size),
      consts.pnj2color['@']);
  }
  draw_items() {
    for (const [item, positions] of this.current_map_data.items) {

      for (let i = 0; i < positions.length; i++) {
        const coord = this.to_screen_coord(positions[i].x, positions[i].y + consts.header_size);
        const color = consts.item2color[item];

        this.engine.rect(coord, this.char_width, 16, this.current_map.background_color);
        this.engine.text(item, coord, color);
      }
    }
  }
  print_slot(idx, chr, pos) {
    let color;

    if (idx === this.selected_slot) {
      color = consts.OverlayHighlight;
    } else {
      color = consts.OverlayNormal;
    }

    const slot = this.persisted_data.slots[idx];
    const lang = this.personal_info.lang;
    let text = chr + '. ' + make_first_letter_upper(translations.item2description[lang][slot.symbol].text);

    if (slot.usage > 1) {
      text += ' (x' + slot.usage + ')';
    }

    this.engine.text(text, pos, color);
  }
  has_weapon_on_slot(slot: number) {
    return consts.weapon_items.indexOf(this.persisted_data.slots[slot].symbol) > -1;
  }
  has_weapon_equiped() {
    return this.has_weapon_on_slot(0)
        || this.has_weapon_on_slot(1)
        || this.has_weapon_on_slot(2);
  }
  has_throwable_on_slot(slot: number) {
    return consts.throwable_items.indexOf(this.persisted_data.slots[slot].symbol) > -1;
  }
  has_spell_on_slot(slot: number) {
    return consts.spell_items.indexOf(this.persisted_data.slots[slot].symbol) > -1;
  }
  has_usable_item_on_slot(slot: number) {
    return this.has_spell_on_slot(slot);
  }
  has_throwable_item_on_slot(slot: number) {
    return this.has_weapon_on_slot(slot) || this.has_throwable_on_slot(slot);
  }
  get_symbol_at(pos: Pos): string {
    return this.current_map.get_symbol_at(pos.x, pos.y);
  }
  hits_projectile(pos: Pos): [number, number] {
    for (let i = 0; i < this.current_map_data.projectiles.length; i++) {
      const proj = this.current_map_data.projectiles[i];

      if (proj.equals(pos)) {
        return [i, proj.power];
      }
    }

    return [-1, 0];
  }
  projectile2item(projectile_position: number) {
    const proj = this.current_map_data.projectiles[projectile_position];

    if (!this.current_map_data.items.has(proj.symbol)) {
      this.current_map_data.items.set(proj.symbol, []);
    }

    const items = this.current_map_data.items.get(proj.symbol);
    let found_item = false;

    for (let i = 0; i  < items.length; i++) {
      if (items[i].equals(proj)) {
        items[i].usage++;
        found_item = true;
        break;
      }
    }

    if (!found_item) {
      items.push(new ObjPos(proj.x, proj.y, 1, 0));
    }

    this.current_map_data.projectiles.splice(projectile_position, 1);
  }
  draw_overlay() {
    const lang = this.personal_info.lang;

    this.engine.text(this.current_status, this.to_screen_coord(2, 1), consts.White);

    const money = currencyFormatter.format(this.persisted_data.coins) + ' $';
    this.engine.text(money, this.to_screen_coord(consts.char_per_line - money.length - 7, 1), item2color['$']);
    this.engine.text('[esc]', this.to_screen_coord(consts.char_per_line - 6, 1), consts.OverlayNormal);

    const h = consts.map_lines + consts.header_size + 1;

    for (const [chr, pos] of charToCommand) {
      if (this.action !== '') {
        this.engine.text(chr, this.to_screen_coord(pos.x, pos.y + h), consts.OverlaySelected);
      } else if (this.pressed.get(chr)) {
        this.engine.text(chr, this.to_screen_coord(pos.x, pos.y + h), consts.OverlayHighlight);
      } else {
        this.engine.text(chr, this.to_screen_coord(pos.x, pos.y + h), consts.OverlayNormal);
      }
    }

    this.print_slot(0, 'a', this.to_screen_coord(3, h));
    this.print_slot(1, 's', this.to_screen_coord(3, h + 1));
    this.print_slot(2, 'd', this.to_screen_coord(3, h + 2));

    if (this.has_throwable_item_on_slot(this.selected_slot)) {
      const txt = '⇧ ' + translations.lancer[lang];

      if (this.action === 'throw') {
        this.engine.text(txt, this.to_screen_coord(29, h, -2), consts.OverlaySelected);
      } else {
        this.engine.text(txt, this.to_screen_coord(29, h, -2), consts.OverlayHighlight);
      }
    } else {
      this.engine.text('⇧', this.to_screen_coord(29, h, -2), consts.OverlayNormal);
    }

    if (this.has_usable_item_on_slot(this.selected_slot)) {
      const use = translations.use[lang];

      if (this.action === 'use') {
        this.engine.text('␣', this.to_screen_coord(29, h + 1, -3, -2), consts.OverlaySelected);
        this.engine.text(use, this.to_screen_coord(31, h + 1), consts.OverlaySelected);
      } else {
        this.engine.text('␣', this.to_screen_coord(29, h + 1, -3, -2), consts.OverlayHighlight);
        this.engine.text(use, this.to_screen_coord(31, h + 1), consts.OverlayHighlight);
      }
    } else {
      this.engine.text('␣', this.to_screen_coord(29, h + 1, -3, -2), consts.OverlayNormal);
    }

    const current_symbol = this.get_symbol_at(this.persisted_data.hero_position);

    if (this.persisted_data.slots[this.selected_slot].symbol !== '' && current_symbol !== '>' && current_symbol !== '<') {
      const drop = translations.drop[lang];
      this.engine.text('q ' + drop, this.to_screen_coord(29, h + 2), consts.OverlayHighlight);
    } else {
      this.engine.text('q', this.to_screen_coord(29, h + 2), consts.OverlayNormal);
    }
  }
  draw_message(): void {
    if (this.game_over_message !== '') {
      const lang = this.personal_info.lang;
      const retry = translations.retry[lang];

      this.engine.rect(this.to_screen_coord(consts.char_per_line / 2 - 15, 10),
        30 * this.char_width, 16 * 7, this.current_map.background_color);
      this.engine.text(' **************************** ',
        this.to_screen_coord(consts.char_per_line / 2 - 15, 10), consts.OverlayHighlight);

      for (let i = 11; i < 16; i++) {
        this.engine.text('*                            *',
           this.to_screen_coord(consts.char_per_line / 2 - 15, i), consts.OverlayHighlight);
      }

      this.engine.text(' **************************** ',
        this.to_screen_coord(consts.char_per_line / 2 - 15, 16), consts.OverlayHighlight);

      this.engine.text(this.game_over_message,
        this.to_screen_coord(consts.char_per_line / 2 - this.game_over_message.length / 2, 12), consts.OverlayHighlight);
      this.engine.text(retry, this.to_screen_coord(consts.char_per_line / 2 - retry.length / 2, 14), consts.OverlayHighlight);
    }
  }
  draw_main_menu(): void {
    let i = 0;

    for (const [text, func, enabled] of this.main_menu) {
      let txt: string;
      let x = consts.char_per_line / 2 - 7;
      let color: string;

      if (this.menu_position === i) {
        txt = '> ' + text;
      } else {
        txt = text;
        x += 2;
      }

      if (enabled) {
        color = consts.OverlayHighlight;
      } else {
        color = consts.OverlayNormal;
      }

      this.engine.text(txt, this.to_screen_coord(x, 12 + i), color);
      i++;
    }
  }
  draw_menu(): void {
    if (this.is_menu_open) {
      let i;

      this.engine.rect(this.to_screen_coord(consts.char_per_line / 2 - 15, 10),
        30 * this.char_width, 16 * 7, this.current_map.background_color);
      this.engine.text(' **************************** ',
        this.to_screen_coord(consts.char_per_line / 2 - 15, 10), consts.OverlayHighlight);

      for (i = 11; i < 16; i++) {
        this.engine.text('*                            *',
          this.to_screen_coord(consts.char_per_line / 2 - 15, i), consts.OverlayHighlight);
      }

      this.engine.text(' **************************** ',
        this.to_screen_coord(consts.char_per_line / 2 - 15, 16), consts.OverlayHighlight);

      i = 0;

      for (const [text, func, enabled] of this.game_menu) {
        let txt: string;
        let x = consts.char_per_line / 2 - 5;
        let color: string;

        if (this.menu_position === i) {
          txt = '> ' + text;
        } else {
          txt = text;
          x += 2;
        }

        if (enabled) {
          color = consts.OverlayHighlight;
        } else {
          color = consts.OverlayNormal;
        }

        this.engine.text(txt, this.to_screen_coord(x, 12 + i), color);
        i++;
      }
    }
  }
  draw_all(): void {
    this.draw_map();
    this.draw_items();
    this.draw_pnjs();
    this.draw_projectiles();
    this.draw_targets();
    this.draw_overlay();
    this.draw_message();
    this.draw_menu();
  }
  resize(width, height): void {
    this.engine.resize(width, height);
    this.draw();
  }
  refresh_menu(reset_position: boolean): void {
    const save = Labyrinth.get_from_storage();
    const lang = this.personal_info.lang;

    this.main_menu = [
      [ translations.new_game[lang], (l: Labyrinth) => Labyrinth.clear_and_start(l), true ],
      [ translations.load[lang], (l: Labyrinth) => Labyrinth.load_save(l, save), save !== null ],
      [ translations.lang[lang], (l: Labyrinth) => Labyrinth.toggle_language(l), true ],
    ];

    this.game_menu = [
      [ translations.save[lang], (l: Labyrinth) => Labyrinth.save_to_storage(l), true ],
      [ translations.load[lang], (l: Labyrinth) => Labyrinth.load_from_storage(l), save !== null ],
      [ translations.exit[lang], (l: Labyrinth) => Labyrinth.open_main_menu(l), true],
    ];

    if (reset_position) {
      if (this.main_menu[1][2]) {
        this.menu_position = 1;
      } else {
        this.menu_position = 0;
      }
    }
  }
  load_personal_infos() {
    this.personal_info = JSON.parse(window.localStorage.getItem('personal'));

    if (this.personal_info === null) {
      this.personal_info = new PersonalInfos();
      this.personal_info.lang = 'en';
    }
  }
  save_personal_infos() {
    window.localStorage.setItem('personal', JSON.stringify(this.personal_info));
  }
  constructor() {
    this.engine = new Engine(
      'canvas',
      460,
      480,
      16,
      'Inconsolata, monospace');

    this.pressed = new Map([
      [ '1', false ],
      [ '2', false ],
      [ '3', false ],
      [ '4', false ],
      [ '5', false ],
      [ '6', false ],
      [ '7', false ],
      [ '8', false ],
      [ '9', false ],
      [ 'a', false ],
      [ 's', false ],
      [ 'd', false ],
      [ 'q', false ],
      [ ' ', false ],
      [ 'Shift', false ],
      [ 'Escape', false ],
    ]);

    this.current_status = '';
    this.char_width = this.engine.get_char_width();
    this.selected_slot = 0;
    this.action = '';
    this.game_over_message = '';
    this.is_menu_open = false;
    this.is_main_menu = true;

    this.load_personal_infos();
    this.parse_all_maps();
    this.refresh_menu(true);
  }
}
