import {Engine} from './engine';
import {AllMaps} from './map_content';
import * as consts from './const';
import {LevelMap, Pos} from './map_logic';
import {item2color} from './const';

const initial_map = 'bateau';

function get_random_mouvement(pnj): Pos {
  const new_pnj = new Pos(pnj.x, pnj.y);
  const r = Math.floor(Math.random() * 16);
  const mouvement = consts.mouvementMap[r];

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

export class Labyrinth {
  public slots: Array<Item>;

  public pressed: Map<string, boolean>;

  private readonly engine: Engine;

  readonly char_width: number;

  private current_map_name: string;
  private current_status: string;
  private coins: number;
  private current_map: LevelMap;
  private pnjs: Map<string, Pos>;

  private is_hero_over_item = false;
  private selected_slot: number;

  static parse_all_maps(): void {
    for (const [key, map] of AllMaps) {
      map.parse(key);
    }
  }
  draw(): void {
    this.engine.clear(this.current_map.background_color);
    this.draw_all();
  }
  do_update(): void {
    this.update_on_map();
  }
  get_string_from(x, y, length): string {
    return this.current_map.map.substr(y * (consts.char_per_line + 1) + x, length);
  }
  to_screen_coord(x, y): Pos {
    return new Pos(this.char_width * x, 16 * y);
  }
  update_current_status(hero_pos): void {
    let status_set = false;
    let current_status = this.current_status;

    const current_symbol = this.current_map.get_symbol_at(hero_pos.x, hero_pos.y);
    if (consts.walkable_symbols.indexOf(current_symbol) > -1) {
      current_status = consts.symbol2description[current_symbol].text;

      if (current_status !== '') {
        status_set = true;
      }
    }

    if (!status_set) {
      this.is_hero_over_item = false;

      for (const [item, positions] of this.current_map.item_positions) {
        for (let i = 0 ; i < positions.length; i++) {
          if (positions[i].equals(hero_pos)) {
            this.is_hero_over_item = true;
            const description = consts.item2description[item];
            current_status = consts.un[description.genre] + description.text;

            if (item !== '$' && consts.shop_maps.indexOf(this.current_map_name) > -1) {
              current_status += ' (' + consts.item2price[item] + '.-)';
            }

            status_set = true;
            break;
          }
        }

        if (status_set) {
          break;
        }
      }
    }

    if (!status_set) {
      this.current_status = '';
    } else {
      this.current_status = current_status;
    }
  }
  drop_item(pos: Pos) {
    // Drop item on the ground if any
    const selected_slot = this.slots[this.selected_slot];

    if (selected_slot.symbol !== '') {
      if (!this.current_map.item_positions.has(selected_slot.symbol)) {
        this.current_map.item_positions.set(selected_slot.symbol, []);
      }

      this.current_map.item_positions.get(selected_slot.symbol).push(pos);
    }
  }
  try_pick_or_drop_item(hero_pos): boolean {
    if (this.pressed.get('D')) {
      if (this.slots[this.selected_slot].symbol === '') {
        this.current_status = 'Il n\'y a rien à déposer';
        return true;
      }

      for (const [item, positions] of this.current_map.item_positions) {
        for (let i = 0; i < positions.length; i++) {
          if (positions[i].equals(hero_pos)) {
            this.current_status = 'Il y a déjà un objet ici';
            return true;
          }
        }
      }

      this.drop_item(hero_pos);
      this.slots[this.selected_slot].symbol = '';
      this.slots[this.selected_slot].usage = -1;

      this.pressed.set('D', false);
      return true;
    }

    if (this.pressed.get('p')) {
      let item_picked = false;
      let coins = this.coins;
      let current_status = this.current_status;
      const is_shop = consts.shop_maps.indexOf(this.current_map_name) > -1;

      for (const [item, positions] of this.current_map.item_positions) {
        const price = consts.item2price[item];
        const description = consts.item2description[item];

        for (let i = 0 ; i < positions.length; i++) {
          if (positions[i].equals(hero_pos)) {
            if (item === '$') {
              coins++;
              positions.splice(i, 1);
              current_status = description.text + consts.pris[description.genre];
            } else if (!is_shop || coins >= price) {
              this.drop_item(positions[i]);

              // Take the item to weapon slot
              this.slots[this.selected_slot].symbol = item;

              const upper = make_first_letter_upper(description.text);

              if (is_shop) {
                coins -= price;
                current_status = upper + consts.achete[description.genre] + ' pour ' + price + '.-';
              } else {
                current_status = upper + consts.pris[description.genre];
              }

              positions.splice(i, 1);
            } else {
              current_status = 'Pas assez d\'argent!';
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
        this.current_status = 'Il n\'y a rien à prendre.';
      } else {
        this.coins = coins;
        this.current_status = current_status;
      }

      this.pressed.set('p', false);
      return true;
    }

    return false;
  }
  try_enter_or_exit(hero_pos): [boolean, Pos, string] {
    if (this.pressed.get('>'))  {
      if (this.current_map.get_symbol_at(hero_pos.x, hero_pos.y) !== '>') {
        this.current_status = 'Il n\'y a pas d\'entrée ici.';
        return [ false, undefined, undefined ];
      }

      return this.do_teleport('>', hero_pos, hero_pos, hero_pos);
    } else if (this.pressed.get('<')) {
      if (this.current_map.get_symbol_at(hero_pos.x, hero_pos.y) !== '<') {
        this.current_status = 'Il n\'y a pas de sortie ici.';
        return [ false, undefined, undefined ];
      }

      return this.do_teleport('<', hero_pos, hero_pos, hero_pos);
    }

  }
  try_talk(future_pos: Pos): boolean {
    for (const [pnj, pnj_pos] of this.pnjs) {
      if (pnj === '@') {
        return false;
      }

      if (pnj_pos.equals(future_pos)) {
        this.current_status = consts.pnj2dialog[pnj];
        return true;
      }
    }

    return false;
  }
  move_pnjs(future_pos): void {
    for (const [p, pnj] of this.pnjs) {
      if (p === '@') {
        return;
      }

      if (this.current_map.pnj2position !== undefined && this.current_map.pnj2position.has(p)) {
        this.pnjs.set(p, this.current_map.pnj2position.get(p)(this, pnj, future_pos));
      } else {
        const new_pnj = get_random_mouvement(pnj);

        if (!new_pnj.equals(future_pos)
          && consts.walkable_symbols.indexOf(this.current_map.get_symbol_at(new_pnj.x, new_pnj.y)) > -1) {
          this.pnjs.set(p, new_pnj);
        }
      }
    }
  }
  move_hero(hero_pos: Pos, future_pos: Pos): Pos {
    const ret = this.try_teleport(hero_pos, future_pos);

    if (ret[0]) {
      if (ret[2] !== undefined) {
        this.change_map(ret[2]);
      }

      hero_pos = ret[1];
      this.pnjs.set('@', ret[1]);
    } else {
      hero_pos = future_pos;
      this.pnjs.set('@', future_pos);
    }

    this.update_current_status(hero_pos);
    return hero_pos;
  }
  get_future_position(hero_pos): [Pos, string] {
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

    let symbol = this.current_map.get_symbol_at(future_pos.x, future_pos.y);

    if (allowed_walking_symbols.indexOf(symbol) > -1) {
      return [future_pos, ''];
    }

    if (hero_pos.y !== future_pos.y) {
      symbol = this.current_map.get_symbol_at(hero_pos.x, future_pos.y);

      if (allowed_walking_symbols.indexOf(symbol) > -1) {
        return [new Pos(hero_pos.x, future_pos.y), ''];
      } else {
        if (future_pos.x !== hero_pos.x) {
          symbol = this.current_map.get_symbol_at(future_pos.x, hero_pos.y);
        }

        if (allowed_walking_symbols.indexOf(symbol) > -1) {
          return [new Pos(future_pos.x, hero_pos.y), ''];
        } else {
          let status = consts.tile2text[symbol];

          if (status === undefined) {
            status = '';
          }

          return [hero_pos, status];
        }
      }
    } else {
      symbol = this.current_map.get_symbol_at(future_pos.x, hero_pos.y);

      if (allowed_walking_symbols.indexOf(symbol) > -1) {
        return [new Pos(future_pos.x, hero_pos.y), ''];
      } else {
        let status = consts.tile2text[symbol];

        if (status === undefined) {
          status = '';
        }

        return [ hero_pos, status ];
      }
    }
  }
  change_map(map_name): void {
    this.current_map = AllMaps.get(map_name);
    this.current_map_name = map_name;
    this.pnjs = new Map<string, Pos>();

    for (const [pnj, positions] of this.current_map.pnj_positions) {
      this.pnjs.set(pnj, positions[Math.floor(Math.random() * positions.length)]);
    }

    this.pnjs.set('@', this.current_map.start);
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
  update_on_map() {
    if (this.pressed.get('a')) {
      this.selected_slot = 0;
      this.pressed.set('a', false);
      return;
    }

    if (this.pressed.get('s')) {
      this.selected_slot = 1;
      this.pressed.set('s', false);
      return;
    }

    if (this.pressed.get('d')) {
      this.selected_slot = 2;
      this.pressed.set('d', false);
      return;
    }

    let hero_pos = this.pnjs.get('@');
    const future_pos = this.get_future_position(hero_pos);

    if (this.try_pick_or_drop_item(hero_pos)) {
      return;
    }

    const selected_slot = this.slots[this.selected_slot];

    if (selected_slot.usage !== -1) {
      if (selected_slot.usage > 0) {
        console.log('Launch fireball!!');
        selected_slot.usage--;
      } else {
        this.current_status = 'Sort épuisé';
      }

      return;
    }

    if (future_pos[1] !== '') {
      this.current_status = future_pos[1];
      return;
    }

    const ret = this.try_enter_or_exit(hero_pos);

    if (ret !== undefined) {
      if (ret[0]) {
        this.change_map(ret[2]);
        this.pnjs.set('@', ret[1]);
      }

      return;
    }

    if (this.try_talk(future_pos[0])) {
      return;
    }

    hero_pos = this.move_hero(hero_pos, future_pos[0]);
    this.move_pnjs(hero_pos);
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
      for (const [text, pos] of this.current_map.texts) {
        this.engine.text(text, this.to_screen_coord(pos.x, pos.y), this.current_map.text_color);
      }
    }
  }
  draw_pnjs() {
    for (const [p, pnj] of this.pnjs) {
      const coord = this.to_screen_coord(pnj.x, pnj.y + consts.header_size);
      const color = consts.pnj2color[p];

      this.engine.rect(coord, this.char_width, 16, this.current_map.background_color);
      this.engine.text(p, coord, color);
    }
  }
  draw_items() {
    for (const [item, positions] of this.current_map.item_positions) {

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

    const slot = this.slots[idx];
    let text = '[' + chr + '] ' + make_first_letter_upper(consts.item2description[slot.symbol].text;

    if (slot.usage !== -1) {
      text += ' (x' + slot.usage + ')';
    }

    this.engine.text(text, pos, color);
  }

  draw_overlay() {
    this.engine.text('  > ' + this.current_status, this.to_screen_coord(0, 1), consts.White);

    const money = currencyFormatter.format(this.coins) + ' $';
    this.engine.text(money, this.to_screen_coord(consts.char_per_line - money.length, 1), item2color['$']);

    const h = consts.map_lines + consts.header_size + 1;

    for (const [chr, pos] of charToCommand) {
      if (this.slots[this.selected_slot].usage !== -1) {
        this.engine.text('[' + chr + ']', this.to_screen_coord(pos.x, pos.y + h), '#FF0000');
      } else if (this.pressed.get(chr)) {
        this.engine.text('[' + chr + ']', this.to_screen_coord(pos.x, pos.y + h), consts.OverlayHighlight);
      } else {
        this.engine.text('[' + chr + ']', this.to_screen_coord(pos.x, pos.y + h), consts.OverlayNormal);
      }
    }

    this.print_slot(0, 'a', this.to_screen_coord(3, h));
    this.print_slot(1, 's', this.to_screen_coord(3, h + 1));
    this.print_slot(2, 'd', this.to_screen_coord(3, h + 2));

    const hero = this.pnjs.get('@');
    const symbol_over = this.current_map.get_symbol_at(hero.x, hero.y);

    if (symbol_over === '<') {
      this.engine.text('[<]', this.to_screen_coord(29, h + 2), consts.OverlayHighlight);
    } else {
      this.engine.text('[<]', this.to_screen_coord(29, h + 2), consts.OverlayNormal);
    }

    if (symbol_over === '>') {
      this.engine.text('[>]', this.to_screen_coord(33, h + 2), consts.OverlayHighlight);
    } else {
      this.engine.text('[>]', this.to_screen_coord(33, h + 2), consts.OverlayNormal);
    }

    if (this.is_hero_over_item) {
      this.engine.text('[p]', this.to_screen_coord(33, h + 1), consts.OverlayHighlight);
    } else {
      this.engine.text('[p]', this.to_screen_coord(33, h + 1), consts.OverlayNormal);
    }

    if (this.slots[this.selected_slot].symbol !== '') {
      this.engine.text('[D]', this.to_screen_coord(29, h + 1), consts.OverlayHighlight);
    } else {
      this.engine.text('[D]', this.to_screen_coord(29, h + 1), consts.OverlayNormal);
    }
  }
  draw_all(): void {
    this.draw_map();
    this.draw_items();
    this.draw_pnjs();
    this.draw_overlay();
  }
  resize(width, height): void {
    this.engine.resize(width, height);
    this.draw();
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
      [ 'p', false ],
      [ 'D', false ],
      [ '>', false ],
      [ '<', false ],
    ]);

    this.current_status = '';
    this.coins = 10000;
    this.char_width = this.engine.get_char_width();

    this.slots = new Array<Item>(3);
    this.slots[0] = new Item('/', -1);
    this.slots[1] = new Item('f', 3);
    this.slots[2] = new Item('', -1);

    this.selected_slot = 0;

    Labyrinth.parse_all_maps();

    this.change_map(initial_map);
   }
}
