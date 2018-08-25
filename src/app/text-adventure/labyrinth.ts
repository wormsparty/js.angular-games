import {Engine} from './engine';
import {AllMaps} from './map_content';
import * as consts from './const';
import {LevelMap, Pos, ObjPos} from './map_logic';
import {item2color, item2description} from './const';

const initial_map = 'training';

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

  private selected_slot: number;
  private action: string;

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
  to_screen_coord(x, y, dx = 0, dy = 0): Pos {
    return new Pos(this.char_width * x + dx, 16 * y + dy);
  }
  update_current_status(hero_pos): void {
    let status_set = false;
    let current_status = this.current_status;

    const current_symbol = this.get_symbol_at(hero_pos);
    if (consts.walkable_symbols.indexOf(current_symbol) > -1) {
      current_status = consts.symbol2description[current_symbol].text;

      if (current_status !== '') {
        status_set = true;
      }
    }

    if (!status_set) {
      for (const [item, positions] of this.current_map.item_positions) {
        for (let i = 0 ; i < positions.length; i++) {
          if (positions[i].equals(hero_pos)) {
            if (item === '$') {
              this.coins++;
              positions.splice(i, 1);
              current_status = '> 1 $' + consts.pris['M'];
            } else {
              const description = consts.item2description[item];

              if (positions[i].price > 0) {
                current_status = '[5] Acheter ' + description.text + ' (' + consts.item2price[item] + '.-)';
              } else {
                current_status = '[5] Prendre ' + description.text;
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
    }

    if (!status_set) {
      this.current_status = '';
    } else {
      this.current_status = current_status;
    }
  }
  drop_current_slot_item_at(pos: Pos) {
    // Drop item on the ground if any
    const selected_slot = this.slots[this.selected_slot];

    if (selected_slot.symbol !== '') {
      if (!this.current_map.item_positions.has(selected_slot.symbol)) {
        this.current_map.item_positions.set(selected_slot.symbol, []);
      }

      this.current_map.item_positions.get(selected_slot.symbol).push(new ObjPos(pos.x, pos.y, selected_slot.usage, 0));
    }
  }
  try_pick_or_drop_item(hero_pos): boolean {
    if (this.pressed.get('q')) {
      const selected_slot = this.slots[this.selected_slot];

      if (selected_slot.symbol === '') {
        this.current_status = '> Il n\'y a rien à déposer';
        return true;
      }

      for (const [item, positions] of this.current_map.item_positions) {
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

      const desc = item2description[selected_slot.symbol];
      this.current_status = '> ' + make_first_letter_upper(desc.text) + consts.depose[desc.genre];

      this.drop_current_slot_item_at(hero_pos);

      selected_slot.symbol = '';
      selected_slot.usage = -1;
      this.action = '';

      return true;
    }

    if (this.pressed.get('5')) {
      let item_picked = false;
      let coins = this.coins;
      let current_status = this.current_status;

      for (const [item, positions] of this.current_map.item_positions) {
        const description = consts.item2description[item];

        for (let i = 0 ; i < positions.length; i++) {
          if (positions[i].equals(hero_pos)) {
            const price = positions[i].price;

            if (coins >= price) {
              // Take the item to weapon slot
              let found_slot = false;

              if (consts.throwable_items.indexOf(item) > -1) {
                for (let j = 0; j < 3 ; j++) {
                  if (this.slots[j].symbol === item) {
                    this.slots[j].usage++;
                    found_slot = true;
                    break;
                  }
                }
              }

              if (!found_slot) {
                this.drop_current_slot_item_at(positions[i]);
                this.slots[this.selected_slot].symbol = item;
                this.slots[this.selected_slot].usage = positions[i].usage;
              }

              const upper = make_first_letter_upper(description.text);

              if (price > 0) {
                coins -= price;
                current_status = '> ' + upper + consts.achete[description.genre] + ' pour ' + price + '.-';
              } else {
                current_status = '> ' + upper + consts.pris[description.genre];
              }

              positions.splice(i, 1);
            } else {
              current_status = '> Pas assez d\'argent!';
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
        this.coins = coins;
        this.current_status = current_status;
      }

      return true;
    }

    return false;
  }
  try_enter_or_exit(hero_pos): [boolean, Pos, string] {
    if (this.pressed.get('5')) {
      const symbol = this.get_symbol_at(hero_pos);

      if (symbol !== '>' && symbol !== '<') {
        this.current_status = '> Il n\'y a pas d\'escalier ici.';
        return [false, undefined, undefined];
      }

      // By symmetry
      if (symbol === '>') {
        this.current_status = '[5] Sortir';
      } else {
        this.current_status = '[5] Entrer';
      }

      return this.do_teleport(symbol, hero_pos, hero_pos, hero_pos);
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
          && consts.walkable_symbols.indexOf(this.get_symbol_at(new_pnj)) > -1) {
          this.pnjs.set(p, new_pnj);
        }
      }
    }
  }
  move_hero(hero_pos: Pos, walkable_pos: Pos, aim_pos: Pos): Pos {
    const ret = this.try_teleport(hero_pos, walkable_pos);

    if (ret[0]) {
      this.change_map(ret[2]);
      hero_pos = ret[1];
      this.pnjs.set('@', ret[1]);
    } else {
      if (!this.try_hit_target(hero_pos, aim_pos)) {
        hero_pos = walkable_pos;
        this.pnjs.set('@', walkable_pos);
        this.update_current_status(hero_pos);
      } else {
        this.current_status = '> Cible touchée!';
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
          let status = consts.tile2text[symbol];

          if (status === undefined) {
            status = '';
          }

          return [hero_pos, future_pos, status];
        }
      }
    } else {
      symbol = this.current_map.get_symbol_at(future_pos.x, hero_pos.y);

      if (allowed_walking_symbols.indexOf(symbol) > -1) {
        return [new Pos(future_pos.x, hero_pos.y), future_pos, ''];
      } else {
        let status = consts.tile2text[symbol];

        if (status === undefined) {
          status = '';
        }

        return [ hero_pos, future_pos, status ];
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
  try_hit_target(hero_pos: Pos, aim_pos: Pos): boolean {
    if (this.current_map.target_spawner === undefined) {
      return false;
    }

    const targets = this.current_map.target_spawner.targets;

    for (let i = 0; i < targets.length;) {
      const target = targets[i];

      if (target.pos.equals(aim_pos)) {
        targets.splice(i, 1);
        return true;
      }

      i++;
    }
  }
  update_targets() {
    if (this.current_map.target_spawner !== undefined) {
      this.current_map.target_spawner.update(this);
    }
  }
  update_on_map() {
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

    if (this.pressed.get(' ') && this.has_usable_item_on_slot(this.selected_slot)) {
      if (this.has_consumable_on_slot(this.selected_slot)) {
        this.current_status = '> TODO: Utiliser consomable';
        this.slots[this.selected_slot].symbol = '';
        this.slots[this.selected_slot].usage = -1;
        this.action = '';
      } else {
        if (this.action !== 'use') {
          this.action = 'use';
        } else {
          this.action = '';
        }
      }

      this.update_targets();
      return;
    }

    let hero_pos = this.pnjs.get('@');
    const future_pos = this.get_future_position(hero_pos);

    const ret = this.try_enter_or_exit(hero_pos);

    if (ret !== undefined) {
      if (ret[0]) {
        this.change_map(ret[2]);
        this.pnjs.set('@', ret[1]);
        return;
      }
    }

    if (this.try_pick_or_drop_item(hero_pos)) {
      this.update_targets();
      return;
    }

    const selected_slot = this.slots[this.selected_slot];

    if (this.action === 'use') {
      if (this.has_spell_on_slot(this.selected_slot)) {
        if (selected_slot.usage > 0) {
          this.current_status = '> TODO: Lancer sort';
          selected_slot.usage--;
        } else {
          this.current_status = '> Sort épuisé';
        }

        this.action = '';
        this.update_targets();
        return;
      }
    }

    if (this.action === 'throw') {
      if (this.has_weapon_on_slot(this.selected_slot)) {
        this.current_status = '> TODO: Lancer arme';
        selected_slot.symbol = '';
        selected_slot.usage = -1;
        this.action = '';
        this.update_targets();
        return;
      }

      if (this.has_throwable_on_slot(this.selected_slot)) {
        this.current_status = '> TODO: Lancer object';
        selected_slot.usage--;

        if (selected_slot.usage <= 0) {
          selected_slot.symbol = '';
          selected_slot.usage = -1;
        }

        this.action = '';
        this.update_targets();
        return;
      }
    }

    if (future_pos[2] !== '') {
      this.current_status = future_pos[2];
      this.update_targets();
      return;
    }

    if (this.try_talk(future_pos[0])) {
      return;
    }

    hero_pos = this.move_hero(hero_pos, future_pos[0], future_pos[1]);
    this.move_pnjs(hero_pos);
    this.update_targets();
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
  draw_targets() {
    if (this.current_map.target_spawner !== undefined) {
      for (const target of this.current_map.target_spawner.targets) {
        this.engine.rect(this.to_screen_coord(target.pos.x, target.pos.y + consts.header_size),
          this.char_width, 16, this.current_map.background_color);
        this.engine.text(target.symbol, this.to_screen_coord(target.pos.x, target.pos.y + consts.header_size), '#FF9900');
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
    let text = chr + '. ' + make_first_letter_upper(consts.item2description[slot.symbol].text);

    if (slot.usage > 1) {
      text += ' (x' + slot.usage + ')';
    }

    this.engine.text(text, pos, color);
  }
  has_weapon_on_slot(slot: number) {
    return consts.weapon_items.indexOf(this.slots[slot].symbol) > -1;
  }
  has_throwable_on_slot(slot: number) {
    return consts.throwable_items.indexOf(this.slots[slot].symbol) > -1;
  }
  has_spell_on_slot(slot: number) {
    return consts.spell_items.indexOf(this.slots[slot].symbol) > -1;
  }
  has_consumable_on_slot(slot: number) {
    return consts.consumable_items.indexOf(this.slots[slot].symbol) > -1;
  }
  has_usable_item_on_slot(slot: number) {
    return this.has_consumable_on_slot(slot) || this.has_spell_on_slot(slot);
  }
  has_throwable_item_on_slot(slot: number) {
    return this.has_weapon_on_slot(slot) || this.has_throwable_on_slot(slot);
  }
  has_item_or_pnj_at(pos: Pos, current_pnj: string) {
    for (const [item, positions] of this.current_map.item_positions) {
      for (let i = 0; i < positions.length; i++) {
        if (positions[i].equals(pos)) {
          return true;
        }
      }
    }

    for (const [pnj, pnj_pos] of this.pnjs) {
      if (pnj !== current_pnj && pnj_pos.equals(pos)) {
        return true;
      }
    }

    return false;
  }
  get_symbol_at(pos: Pos): string {
    return this.current_map.get_symbol_at(pos.x, pos.y);
  }
  draw_overlay() {
    this.engine.text(this.current_status, this.to_screen_coord(2, 1), consts.White);

    const money = currencyFormatter.format(this.coins) + ' $';
    this.engine.text(money, this.to_screen_coord(consts.char_per_line - money.length, 1), item2color['$']);

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
      if (this.action === 'throw') {
        this.engine.text('⇧ Lancer', this.to_screen_coord(29, h, -2), consts.OverlaySelected);
      } else {
        this.engine.text('⇧ Lancer', this.to_screen_coord(29, h, -2), consts.OverlayHighlight);
      }
    } else {
      this.engine.text('⇧', this.to_screen_coord(29, h, -2), consts.OverlayNormal);
    }

    if (this.has_usable_item_on_slot(this.selected_slot)) {
      if (this.action === 'use') {
        this.engine.text('␣', this.to_screen_coord(29, h + 1, -3, -2), consts.OverlaySelected);
        this.engine.text('Utiliser', this.to_screen_coord(31, h + 1), consts.OverlaySelected);
      } else {
        this.engine.text('␣', this.to_screen_coord(29, h + 1, -3, -2), consts.OverlayHighlight);
        this.engine.text('Utiliser', this.to_screen_coord(31, h + 1), consts.OverlayHighlight);
      }
    } else {
      this.engine.text('␣', this.to_screen_coord(29, h + 1, -3, -2), consts.OverlayNormal);
    }

    const hero_pos = this.pnjs.get('@');
    const current_symbol = this.get_symbol_at(hero_pos);

    if (this.slots[this.selected_slot].symbol !== '' && current_symbol !== '>' && current_symbol !== '<') {
      this.engine.text('q Déposer', this.to_screen_coord(29, h + 2), consts.OverlayHighlight);
    } else {
      this.engine.text('q', this.to_screen_coord(29, h + 2), consts.OverlayNormal);
    }
  }
  draw_all(): void {
    this.draw_map();
    this.draw_items();
    this.draw_pnjs();
    this.draw_targets();
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
      [ 'q', false ],
      [ ' ', false ],
      [ 'Shift', false ],
    ]);

    this.current_status = '';
    this.coins = 10000;
    this.char_width = this.engine.get_char_width();

    this.slots = new Array<Item>(3);
    this.slots[0] = new Item('/', -1);
    this.slots[1] = new Item('=', consts.spell_usage['=']);
    this.slots[2] = new Item('*', 10);

    this.selected_slot = 0;
    this.action = '';

    Labyrinth.parse_all_maps();

    this.change_map(initial_map);
   }
}
