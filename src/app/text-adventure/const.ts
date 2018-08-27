export const char_per_line = 56;
export const map_lines = 22;
export const header_size = 3;

export const DefaultBackgroundColor = '#000000';
export const DefaultTextColor =  '#FFFF00';
export const White = '#FFFFFF';
export const OverlayNormal =  '#555555';
export const OverlayHighlight =  '#FFFFFF';
export const OverlaySelected =  '#FF00FF';

/*
 * Map
 */
export const globalTile2color = {
  '#': '#646464',
  '.': '#646464',
  '~': '#C8C8C8',
};

export const teleport_symbols: Array<string> = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '>', '<' ];
export const item_symbols: Array<string> = [ '*', '$', '/', '\\' ];
export const walkable_symbols: Array<string> = [ '.', '<', '>' ];
export const obstacle_symbols: Array<string> = [ 'x' ];

/*
 * PNJ
 */
export const pnj2color = {
  't': '#6699FF',
  '@': '#FF0000',
};

export const mouvement_map = {
  0: {x: 1, y: 0},
  1: {x: -1, y: 0},
  2: {x: 0, y: 1},
  3: {x: 0, y: -1},
  4: {x: 1, y: 1},
  5: {x: -1, y: 1},
  6: {x: 1, y: -1},
  7: {x: -1, y: -1},
};

/*
 * Items
 */
export const item2color = {
  '$': '#FFFF00',
  '=': '#FF0000',
  '*': '#dd99FF',
  '%': '#119900',
  '/': '#999999',
  '\\': '#FFFFFF',
};

export const weapon_items = [ '/', '\\' ];
export const throwable_items = [ '*' ];

export const projectile2color = {
  '*': '#999999',
  '&': '#FF0000',
};

export const weapon2damage = {
  '/': 1,
  '\\': 3,
  '': 0,
};
