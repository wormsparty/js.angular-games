export const char_per_line = 56;
export const map_lines = 22;
export const header_size = 3;

export const DefaultBackgroundColor = '#000000';
export const DefaultTextColor =  '#FFFF00';
export const White =  '#FFFFFF';
export const OverlayNormal =  '#555555';
export const OverlayHighlight =  '#FFFFFF';

export const globalTile2color = {
  '#': '#646464',
  '.': '#646464',
  '~': '#C8C8C8',
};

export const pnj2color = {
  'g': '#0000FF',
  'm': '#6699FF',
  '@': '#FF0000',
  'O': '#FF0000',
};

export const item2color = {
  '$': '#FFFF00',
  '(': '#FF8800',
  '&': '#FF0000',
  '[': '#FF0088',
  ']': '#FF00FF',
  '*': '#dd99FF',
  '{': '#00FFFF',
  ')': '#0000FF',
  '}': '#00FF00',
  '%': '#119900',
  '!': '#555555',
  '?': '#FFFFFF',
  '/': '#222222',
};

export const item2price = {
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
  '/': 50,
};

export const mouvementMap = {
  0: {x: 1, y: 0},
  1: {x: -1, y: 0},
  2: {x: 0, y: 1},
  3: {x: 0, y: -1},
  4: {x: 1, y: 1},
  5: {x: -1, y: 1},
  6: {x: 1, y: -1},
  7: {x: -1, y: -1},
};

export const item2description = {
  '$': { text: 'pièce de 1.-', genre: 'F' },
  '%': { text: 'laitue', genre: 'F' },
  '&': { text: 'tomate', genre: 'F' },
  '(': { text: 'bout de bois gauche', genre: 'M' },
  ')': { text: 'bout de bois droit', genre: 'M' },
  '[': { text: 'crochet gauche', genre: 'M' },
  ']': { text: 'crochet droit', genre: 'M' },
  '{': { text: 'arc gauche', genre: 'M' },
  '}': { text: 'arc droit', genre: 'M' },
  '*': { text: 'caillou', genre: 'M' },
  '?': { text: 'potion mystère', genre: 'F' },
  '!': { text: 'sort mystère', genre: 'M' },
  '/': { text: 'épée', genre: 'F'},
  '' : { text: 'aucune arme', genre: 'F' }
};

export const spell2description = {
  'f': 'boule de feu',
  '': 'aucun sort',
};

export const symbol2description = {
  '>': { text: 'Une entrée' },
  '<': { text: 'Une sortie' },
  '.': { text: ''}
};

export const tile2text = {
  '#': 'Aïe! Un mur.',
  '~': 'C\'est toxique!',
};

export const pnj2dialog = {
  'm': 'Fuits et légumes frais!',
  'g': 'Je ne te laisserai pas passer sans épée',
};

export const un = {
  'M': 'Un ',
  'F': 'Une ',
};

export const pris = {
  'M': ' pris',
  'F': ' prise',
};

export const achete = {
  'M': ' acheté',
  'F': ' achetée'
};

export const teleport_symbols: Array<string> = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '>', '<' ];
export const item_symbols: Array<string> = [ '{', '}', '[', ']', '(', ')', '&', '%', '!', '?', '*', '$', '/'];
export const walkable_symbols: Array<string> = [ '.', '<', '>' ];
export const shop_maps: Array<string> = [ 'outside' ];
