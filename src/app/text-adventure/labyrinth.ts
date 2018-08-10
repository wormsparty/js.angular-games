import {Engine} from './engine';

const maps = {
  outside: {
    map: '' +
      '#.....#                                #...............#                        \n' +
      '#.....#                                #...............#                        \n' +
      '#.....#                               #.................#                       \n' +
      '#.....#                               #..................######                 \n' +
      '#.....#                              #.........................##########       \n' +
      '#.....#                ########   ###....................................###    \n' +
      '#.....#               #        ###..........................................#   \n' +
      '#.....#              #         ..............................................#  \n' +
      '#.....#              #  Manger ...............................................# \n' +
      '#.....#              #         ...............................................# \n' +
      '#.....#               #        ###............................................# \n' +
      '#.....#                ########   #...........................................# \n' +
      '#......#                          #...........................................# \n' +
      '#.......##                        #.................##...######...............# \n' +
      ' #........########################................##           ###...........#  \n' +
      '  ##.............................................#                #..........#  \n' +
      '    ##...........................................#                #..........#  \n' +
      '      ############################...............#   Travailler   #.........#   \n' +
      '                                  ##.............#                #.........#   \n' +
      '              h : aide              #............#                #........#    \n' +
      '                                    #.............##            ##.........#    \n' +
      '                                    #...............##~~~#######..........#     \n' +
      '                                    #...............~~~~~~~..............#      \n' +
      '                                     ##..............~~~~~............###       \n' +
      '                                       ##.........................####          \n' +
      '                                         #########################              ',
    meta: '' +
      '#44444#                                #555555555555555#                        \n' +
      '#     #                                #               #                        \n' +
      '#     #                               #                 #                       \n' +
      '#     #                               #                  ######                 \n' +
      '#     #                              #                         ##########       \n' +
      '#     #                ########   ###                                    ###    \n' +
      '#     #               #        ###                                          #   \n' +
      '#     #              #         1                                             #  \n' +
      '#     #              #         1                                              # \n' +
      '#     #              #         1                                              # \n' +
      '#     #               #        ###                                            # \n' +
      '#     #                ########   #                                           # \n' +
      '#      #                          #                                           # \n' +
      '#       ##                        #                 ##222######               # \n' +
      ' #        ########################                ##           ###           #  \n' +
      '  ##                                             #                #          #  \n' +
      '    ##                                           #                #          #  \n' +
      '      ############################               #                #         #   \n' +
      '                                  ##             #                #         #   \n' +
      '                                    #            #                #        #    \n' +
      '                                    #             ##            ##         #    \n' +
      '                                    #               ##333#######          #     \n' +
      '                                    #                                    #      \n' +
      '                                     ##                               ###       \n' +
      '                                       ##                         ####          \n' +
      '                                         #########################              ',
    teleport_map: {
      1: 'coop',
      2: 'rez',
      3: 'premier',
      4: 'rue',
      5: 'lac'
    }
  },
  rez: {
    map: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                 Travailler - rez                               \n' +
      '                                                                                \n' +
      '                      #####...############################                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #.....########.....................#                      \n' +
      '                      #............#.....................#                      \n' +
      '                      #............#.....................#                      \n' +
      '                      #............#.....................#                      \n' +
      '                      #............#.....................#                      \n' +
      '                      ####################################                      \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    meta: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                      #####222############################                      \n' +
      '                      #                                  #                      \n' +
      '                      #     @                            #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                        %         #                      \n' +
      '                      #      #######                     #                      \n' +
      '                      #      rrrrrr#                     #                      \n' +
      '                      #      rrrrrr#                     #                      \n' +
      '                      #      rrrrrr#                     #                      \n' +
      '                      #      rrrrrr#                     #                      \n' +
      '                      ####################################                      \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    teleport_map: {
      2: 'outside',
    }
  },
  premier: {
    map: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                 Travailler - 1e                                \n' +
      '                                                                                \n' +
      '                      ####################################                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #####...############################                      \n' +
      '                                                                                \n' +
      '                                   p: prendre                                   \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    meta: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                      ####################################                      \n' +
      '                      #                                  #                      \n' +
      '                      # $$$$$                            #                      \n' +
      '                      # $$$$$                            #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                JJJJJJJ           #                      \n' +
      '                      #                JJJJJJJ           #                      \n' +
      '                      #                JJJJJJJ           #                      \n' +
      '                      #     @                            #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #####333############################                      \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    teleport_map: {
      3: 'outside',
    }
  },
  coop: {
    map: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                    Manger                                      \n' +
      '                                                                                \n' +
      '                       ##################################                       \n' +
      '                      #..................................#                      \n' +
      '                      #...................................                      \n' +
      '                      #...................................                      \n' +
      '                      #.....#.....#.....#.....#####.......                      \n' +
      '                      #.....#.....#.....#.....#...#......#                      \n' +
      '                      #.....#.....#.....#.....#...#......#                      \n' +
      '                      #.....#.....#.....#.....#...#......#                      \n' +
      '                      #.....#.....#.....#.....#####......#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                       ##################################                       \n' +
      '                                                                                \n' +
      '                                   p: acheter                                   \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    meta: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                       ##################################                       \n' +
      '                      #        vvvvvvvv                  #                      \n' +
      '                      #        vvvvvvvv              @   1                      \n' +
      '                      #        vvvvvvvv                  1                      \n' +
      '                      #     #?    #*)   #&]   #####      1                      \n' +
      '                      #     #?    #](   #(}   #ccc#      #                      \n' +
      '                      #     #?    #]*   #}&   #ccc#      #                      \n' +
      '                      #     #?    #{!   #&)   #ccc#      #                      \n' +
      '                      #     #?    #})   #[*   #####      #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                       ##################################                       \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    teleport_map: {
      1: 'outside',
    }
  },
  rue: {
    map: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                      ####################################                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #################.....##############                      \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    meta: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                      ####################################                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #################44444##############                      \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    teleport_map: {
      4: 'outside',
    }
  },
  lac: {
    map: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                      ####################################                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #..................................#                      \n' +
      '                      #########..................#########                      \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    meta: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                      ####################################                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #                                  #                      \n' +
      '                      #########555555555555555555#########                      \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
    teleport_map: {
      5: 'outside',
    },
  },
};

const screens = {
  inventory: {
    map: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '             .~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~.              \n' +
      '             |                                                   |              \n' +
      '             |                    Inventaire                     |              \n' +
      '             |                    ~~~~~~~~~~                     |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^              \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
  },
  help: {
    map: '' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '             .~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~.              \n' +
      '             |                                                   |              \n' +
      '             |                       Aide                        |              \n' +
      '             |                       ~~~~                        |              \n' +
      '             |                                                   |              \n' +
      '             |      Flèches directionnelles: Déplacement         |              \n' +
      '             |      Marchez vers quelqu\'un pour lui parler       |              \n' +
      '             |                                                   |              \n' +
      '             |      i: Ouvrir l\'inventaire                       |              \n' +
      '             |      p: Prendre, acheter                          |              \n' +
      '             |      h: Fermer cette aide                         |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             |                                                   |              \n' +
      '             ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^              \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                \n' +
      '                                                                                ',
  },
};

const initial_map = 'coop';
const char_per_line = 80;
const map_lines = 26;

function parse_all_maps() {
  const teleport_symbols = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const item_symbols = [ '{', '}', '[', ']', '(', ')', '&', '%', '!', '?', '*', '$'];

  for (const key in maps) {
    if (maps.hasOwnProperty(key)) {
      const current_map = maps[key];

      const visual_map = current_map.map.split('\n');
      const meta_map = current_map.meta.split('\n');

      if (visual_map.length !== map_lines) {
        console.log('La carte V ' + key + ' n\'a pas exactement ' + map_lines + ' lignes (' + visual_map.length + ')');
      }

      if (meta_map.length !== map_lines) {
        console.log('La carte M ' + key + ' n\'a pas exactement ' + map_lines + ' lignes (' + meta_map.length + ')');
      }

      for (let i = 0; i < map_lines; i++) {
        if (visual_map[i].length !== char_per_line) {
          console.log('V ' + key + ' ligne ' + i + ' n\'a pas exactement ' + char_per_line + ' caractères (' + visual_map[i].length + ')');
        }

        if (meta_map[i].length !== char_per_line) {
          console.log('M ' + key + ' ligne ' + i + ' n\'a pas exactement ' + char_per_line + ' caractères (' + meta_map[i].length + ')');
        }
      }

      current_map.teleports = {};
      current_map.teleport_count = {};
      current_map.pnj_positions = {};
      current_map.item_positions = {};

      for (let y = 0; y < map_lines; y++) {
        for (let x = 0; x < char_per_line; x++) {
          const chr = meta_map[y][x];

          if (chr === '#') {
            if (visual_map[y][x] !== '#') {
              console.log('Les murs ne marchent pas en (' + x + ', ' + y + '), carte = ' + key);
            }
          }  else if (teleport_symbols.indexOf(chr) > -1) {
            if (current_map.teleports[chr] === undefined) {
              current_map.teleports[chr] = [];
              current_map.teleport_count[chr] = 0;
            }

            current_map.teleports[chr].push({ x: x, y: y, id: current_map.teleport_count[chr] });
            current_map.teleport_count[chr]++;
          } else if (item_symbols.indexOf(chr) > -1) {
            if (current_map.item_positions[chr] === undefined) {
              current_map.item_positions[chr] = [];
            }

            current_map.item_positions[chr].push({x: x, y: y});
          } else if (chr !== ' ' && chr !== undefined) {
            if (chr === '@') {
              current_map.start = {x: x, y: y};
            } else {
              if (current_map.pnj_positions[chr] === undefined) {
                current_map.pnj_positions[chr] = [];
              }

              current_map.pnj_positions[chr].push({x: x, y: y});
            }
          }
        }
      }
    }
  }
}

function parse_all_screens() {
  for (const key in screens) {
    if (screens.hasOwnProperty(key)) {
      const map = screens[key];
      const splitted_map = map.map.split('\n');

      if (splitted_map.length !== map_lines) {
        console.log(key + ' n\'a pas exactement ' + map_lines + ' lines (' + splitted_map.length + ')');
      }

      for (let i = 0 ; i < map_lines; i++) {
        if (splitted_map[i].length !== char_per_line) {
          console.log('L.' + i + ' de ' + key + ' n\'a pas exactement ' + char_per_line + ' caractères (' + splitted_map[i].length + ')');
        }
      }
    }
  }
}

function pos_equal(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function get_background_color() {
  return '#151515';
}

function get_text_color() {
  return '#FFFFFF';
}

const tile2color = {
  '#': '#646464',
  '.': '#646464',
  '~': '#C8C8C8',
};

const pnj2color = {
  'm': '#9B9B9B',
  'v': '#0000FF',
  'c': '#0055DD',
  'J': '#00FFFF',
  'r': '#FF00FF',
  '@': '#FF0000',
};

const item2color = {
  '$': '#FFFF00',
  '(': '#FF8800',
  '&': '#FF0000',
  '[': '#FF0088',
  ']': '#FF00FF',
  '*': '#dd99FF',
  '{': '#00FFFF',
  ')': '#0000FF',
  '}': '#00FF00',
  '%': '#114400',
  '!': '#555555',
  '?': '#FFFFFF',
};

const item2price = {
  '%': 10,
  '&': 2,
  '(': 5,
  ')': 5,
  '[': 10,
  ']': 10,
  '{': 15,
  '}': 15,
  '*': 1,
  '?': 4,
  '!': 2,
};

const item2description = {
  '$': 'Pièce de 1.-',
  '%': 'Masque à gaz',
  '&': 'Canette de Coca',
  '(': 'Bout de bois gauche',
  ')': 'Bout de bois droit',
  '[': 'Crochet gauche',
  ']': 'Crochet droit',
  '{': 'Arc gauche',
  '}': 'Arc droit',
  '*': 'Caillou',
  '?': 'Potion mystère',
  '!': 'Sort mystère',
};

const pnj2dialog = {
  'J': 'La machine à café est cassée!',
  'r': 'Bonjour!',
  'v': 'On ne peut pas sortir sans payer!',
  'c': 'On n\'est pas sensé pouvoir me parler!',
  'm': 'Une pièce?',
};

const mouvementMap = {
  0: {x: 1, y: 0},
  1: {x: -1, y: 0},
  2: {x: 0, y: 1},
  3: {x: 0, y: -1},
  4: {x: 1, y: 1},
  5: {x: -1, y: 1},
  6: {x: 1, y: -1},
  7: {x: -1, y: -1},
};

function get_random_mouvement(pnj) {
  const new_pnj = {x: pnj.x, y: pnj.y};
  const r = Math.floor(Math.random() * 16);
  const mouvement = mouvementMap[r];

  if (mouvement !== undefined) {
    new_pnj.x += mouvement.x;
    new_pnj.y += mouvement.y;
  }

  return new_pnj;
}

export class Labyrinth {
  private readonly engine: Engine;
  private readonly inventory: Array<string>;
  private readonly char_width: number;

  private current_map_name: string;
  private current_status: string;
  private coins: number;
  private current_map;
  private pnjs;

  up: number;
  down: number;
  left: number;
  right: number;
  open_inventory: boolean;
  open_help: boolean;
  pickup: boolean;

  draw() {
    this.engine.clear(get_background_color());

    if (this.open_inventory) {
      this.draw_screen( 'inventory');
    } else if (this.open_help) {
      this.draw_screen('help');
    } else {
      this.draw_all();
    }
  }
  do_update() {
    if (this.open_inventory) {
      this.update_on_inventory();
    } else if (this.open_help) {
      this.update_on_help();
    } else {
      this.update_on_map();
    }
  }
  get_symbol_at(pos) {
    return this.current_map.map[pos.y * (char_per_line + 1) + pos.x];
  }
  get_string_from(x, y, length) {
    return this.current_map.map.substr(y * (char_per_line + 1) + x, length);
  }
  to_screen_coord(x, y) {
    return {x: this.char_width * x, y: 16 * y };
  }
  update_current_status(hero_pos) {
    let item_found = false;
    let current_status = this.current_status;

    for (const item in this.current_map.item_positions) {
      if (this.current_map.item_positions.hasOwnProperty(item)) {
        const positions = this.current_map.item_positions[item];

        for (let i = 0 ; i < positions.length; i++) {
          if (pos_equal(positions[i], hero_pos)) {
            current_status = item2description[item];

            if (item !== '$' && this.current_map_name === 'coop') {
              current_status += ' (' + item2price[item] + '.-)';
            }

            item_found = true;
            break;
          }
        }

        if (item_found) {
          break;
        }
      }
    }

    if (!item_found) {
      this.current_status = '';
    } else {
      this.current_status = current_status;
    }
  }

  try_pick_item(hero_pos) {
    if (this.pickup) {
      let item_picked = false;
      let coins = this.coins;
      let current_status = this.current_status;
      const inventory = this.inventory;
      const current_map = this.current_map;
      const current_map_name = this.current_map_name;

      for (const item in this.current_map.item_positions) {
        if (this.current_map.item_positions.hasOwnProperty(item)) {
          const price = item2price[item];
          const description = item2description[item];
          const positions = current_map.item_positions[item];

          for (let i = 0 ; i < positions.length; i++) {
            if (pos_equal(positions[i], hero_pos)) {
              if (item === '$') {
                coins++;
                positions.splice(i, 1);
                current_status = description + ' pris';
              } else if (current_map_name !== 'coop' || coins >= price) {
                inventory.push(item);

                if (current_map_name === 'coop') {
                  coins -= price;
                  current_status = description + ' acheté pour ' + price + '.-';
                } else {
                  current_status = description + ' pris(e)';
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
      }

      if (!item_picked) {
        this.current_status = 'Il n\'y a rien à prendre.';
      } else {
        this.coins = coins;
        this.current_status = current_status;
      }

      this.pickup = false;
      return true;
    }

    return false;
  }
  try_talk(future_pos) {
    let talked = false;
    const pnjs = this.pnjs;
    let current_status = this.current_status;

    for (const pnj in this.pnjs) {
      if (this.pnjs.hasOwnProperty(pnj)) {
        if (pnj === '@') {
          return false;
        }

        const pnj_pos = pnjs[pnj];

        if (pos_equal(pnj_pos, future_pos)) {
          current_status = pnj2dialog[pnj];
          talked = true;
          break;
        }

      }
    }

    if (talked) {
      this.current_status = current_status;
    }

    return talked;
  }
  move_pnjs(future_pos) {
    for (const p in this.pnjs) {
      if (this.pnjs.hasOwnProperty(p)) {
        if (p === '@') {
          return;
        }

        const pnj = this.pnjs[p];
        const new_pnj = get_random_mouvement(pnj);

        if (!pos_equal(new_pnj, future_pos) && this.get_symbol_at(new_pnj) === '.') {
          this.pnjs[p] = new_pnj;
        }
      }
    }
  }
  move_hero(hero_pos, future_pos) {
    const ret = this.try_teleport(hero_pos, future_pos);

    if (ret.success) {
      if (ret.newmap !== undefined) {
        this.change_map(ret.newmap);
      }

      hero_pos = ret.pos;
      this.pnjs['@'] = ret.pos;
    } else {
      hero_pos = future_pos;
      this.pnjs['@'] = future_pos;
    }

    this.update_current_status(hero_pos);
    return hero_pos;
  }
  get_future_position(hero_pos) {
    const future_pos = {x: hero_pos.x + this.right - this.left, y: hero_pos.y + this.down - this.up};
    let allowed_walking_symbols;

    if (this.inventory.indexOf('%') > -1) {
      allowed_walking_symbols = [ '.', '~' ];
    } else {
      allowed_walking_symbols = [ '.' ];
    }

    let symbol = this.get_symbol_at(future_pos);

    if (allowed_walking_symbols.indexOf(symbol) > -1) {
      return {x: future_pos.x, y: future_pos.y, status: '' };
    }

    if (hero_pos.y !== future_pos.y) {
      symbol = this.get_symbol_at({x: hero_pos.x, y: future_pos.y});

      if (allowed_walking_symbols.indexOf(symbol) > -1) {
        return {x: hero_pos.x, y: future_pos.y, status: ''};
      } else {
        if (future_pos.x !== hero_pos.x) {
          symbol = this.get_symbol_at({x: future_pos.x, y: hero_pos.y});
        }

        if (allowed_walking_symbols.indexOf(symbol) > -1) {
          return {x: future_pos.x, y: hero_pos.y, status: ''};
        } else {
          let status = '';

          if (symbol === '#') {
            status = 'Aïe! Un mur.';
          }

          if (symbol === '~') {
            status = 'C\'est toxique!';
          }

          return {x: hero_pos.x, y: hero_pos.y, status: status};
        }
      }
    } else {
      symbol = this.get_symbol_at({x: future_pos.x, y: hero_pos.y});

      if (allowed_walking_symbols.indexOf(symbol) > -1) {
        return {x: future_pos.x, y: hero_pos.y, status: ''};
      } else {
        let status = '';

        if (symbol === '#') {
          status = 'Aïe! Un mur.';
        }

        if (symbol === '~') {
          status = 'C\'est toxique!';
        }

        return {x: hero_pos.x, y: hero_pos.y, status: status};
      }
    }
  }
  change_map(map_name) {
    this.current_map = maps[map_name];
    this.current_map_name = map_name;
    this.pnjs = {};

    const pnjs = this.pnjs;

    for (const pnj in this.current_map.pnj_positions) {
      if (this.current_map.pnj_positions.hasOwnProperty(pnj)) {
        const positions = maps[map_name].pnj_positions[pnj];
        pnjs[pnj] = positions[Math.floor(Math.random() * positions.length)];
      }
    }

    this.pnjs['@'] = this.current_map.start;
  }
  try_teleport(hero_pos, future_pos) {
    const current_map = this.current_map;

    for (const chr in this.current_map.teleports) {
      if (this.current_map.teleports.hasOwnProperty(chr)) {
        const teleports_for_char = current_map.teleports[chr];

        for (let j = 0; j < teleports_for_char.length; j++) {
          const pos = teleports_for_char[j];

          if (pos_equal(pos, future_pos)) {
            const new_map = current_map.teleport_map[chr];
            const teleports_of_other_map = maps[new_map].teleports[chr];

            const tp = teleports_of_other_map[pos.id];

            let new_x = tp.x + (future_pos.x - hero_pos.x);
            let new_y = tp.y + (future_pos.y - hero_pos.y);

            // Fix the case where teleport + mouvement ends up in a wall!
            if (maps[new_map].map[new_y * (char_per_line + 1) + new_x] === '#') {
              if (maps[new_map].map[new_y * (char_per_line + 1) + tp.x] === '#') {
                new_y = tp.y;
              } else {
                new_x = tp.x;
              }
            }

            return {
              'success': true,
              'pos': {x: new_x, y: new_y},
              'newmap': new_map,
              'newstatus': '',
            };
          }
        }
      }
    }

    return {
      'success': false,
      'pos': undefined,
      'newmap': undefined,
      'newstatus': undefined
    };
  }
  update_on_map() {
    let hero_pos = this.pnjs['@'];
    const future_pos = this.get_future_position(hero_pos);

    if (future_pos.status !== '') {
      this.current_status = future_pos.status;
      return;
    }

    if (this.try_pick_item(hero_pos)) {
      return;
    }

    if (this.try_talk(future_pos)) {
      return;
    }

    hero_pos = this.move_hero(hero_pos, future_pos);
    this.move_pnjs(hero_pos);
  }
  update_on_inventory() {
    // TODO
  }
  update_on_help() {
    // Nothing?
  }
  draw_map() {
    for (let y = 0; y < map_lines; y++) {
      for (let x = 0; x < char_per_line;) {
        let length = 0;
        const val = this.get_symbol_at({x: x, y: y});

        if (val === ' ' || val === '\n' || val === undefined) {
          x++;
          continue;
        }

        while (true) {
          length++;

          const chr = this.get_symbol_at({x: x + length, y: y});

          if (chr !== val) {
            break;
          }
        }

        const coord = this.to_screen_coord(x, y);
        const str = this.get_string_from( x, y, length);
        let color = tile2color[val];

        if (color === undefined) {
          color = get_text_color();
        }

        this.engine.text(str, coord, color);
        x += length;
      }
    }
  }
  draw_pnjs() {
    for (const p in this.pnjs) {
      if (this.pnjs.hasOwnProperty(p)) {
        const pnj = this.pnjs[p];
        const coord = this.to_screen_coord(pnj.x, pnj.y);
        const color = pnj2color[p];

        this.engine.rect(coord, this.char_width, 16, get_background_color());
        this.engine.text(p, coord, color);
      }
    }
  }
  draw_items() {
    for (const item in this.current_map.item_positions) {
      if (this.current_map.item_positions.hasOwnProperty(item)) {
        const positions = this.current_map.item_positions[item];

        for (let i = 0; i < positions.length; i++) {
          const coord = this.to_screen_coord(positions[i].x, positions[i].y);
          const color = item2color[item];

          this.engine.rect(coord, this.char_width, 16, get_background_color());
          this.engine.text(item, coord, color);
        }
      }
    }
  }
  draw_overlay() {
    const text_color = get_text_color();

    this.engine.text('  > ' + this.current_status, {x: 0, y: this.engine.reference_height - 48}, text_color);
    this.engine.text('  PV: 20/20', {x: 0, y: this.engine.reference_height - 32}, text_color);
  }
  draw_all() {
    this.draw_map();
    this.draw_items();
    this.draw_pnjs();
    this.draw_overlay();
  }
  draw_screen(screen_name) {
    const screen = screens[screen_name];

    for (let y = 0; y < map_lines; y++) {
      for (let x = 0; x < char_per_line; x++) {
        const start = y * (char_per_line + 1);
        this.engine.text(screen.map.substring(start, start + char_per_line), {x: 0, y: y * 16}, get_text_color());
      }
    }

    // TODO: Items!
    if (screen_name === 'inventory') {
      let y = 8;
      const x = 18;

      if (this.inventory.length === 0) {
        const coord = this.to_screen_coord(x, y);
        this.engine.text('Rien', coord, get_text_color());
      } else {
        for (const i in this.inventory) {
          if (this.inventory.hasOwnProperty(i)) {
            const item = this.inventory[i];
            const coord = this.to_screen_coord(x, y);
            this.engine.text('[' + i + '] ' + item2description[item], coord, get_text_color());
            y++;
          }
        }
      }
    }
  }
  resize(width, height) {
    this.engine.resize(width, height);
    this.draw();
  }

  constructor() {
    this.engine = new Engine(
      'canvas',
      640,
      480,
      16,
      'Inconsolata, monospace',
      '0');

    this.up = 0;
    this.down = 0;
    this.left = 0;
    this.right = 0;
    this.open_inventory = false;
    this.open_help = false;
    this.pickup = false;
    this.current_status = '';
    this.coins = 0;
    this.char_width = this.engine.get_char_width();
    this.inventory = [];

    parse_all_maps();
    parse_all_screens();

    this.change_map(initial_map);
   }
}
