export const char_per_line = 80;
export const map_lines = 30;

export const BackgroundColor = '#000000';
export const TileBackgroundColor = '#000000';
export const TextColor =  '#FFFF00';
export const White =  '#FFFFFF';

export const globalTile2color = {
  '#': '#646464',
  '.': '#646464',
  '~': '#C8C8C8',
};

export const pnj2color = {
  'm': '#9B9B9B',
  'v': '#0000FF',
  'c': '#0055DD',
  'J': '#00FFFF',
  'r': '#FF00FF',
  '@': '#FF0000',
  't': '#FFFFFF',
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
  '%': '#114400',
  '!': '#555555',
  '?': '#FFFFFF',
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
  '$': { text: 'Pièce de 1.-', genre: 'F' },
  '%': { text: 'Masque à gaz', genre: 'M' },
  '&': { text: 'Canette de Coca', genre: 'F' },
  '(': { text: 'Bout de bois gauche', genre: 'M' },
  ')': { text: 'Bout de bois droit', genre: 'M' },
  '[': { text: 'Crochet gauche', genre: 'M' },
  ']': { text: 'Crochet droit', genre: 'M' },
  '{': { text: 'Arc gauche', genre: 'M' },
  '}': { text: 'Arc droit', genre: 'M' },
  '*': { text: 'Caillou', genre: 'M' },
  '?': { text: 'Potion mystère', genre: 'F' },
  '!': {text: 'Sort mystère', genre: 'M' },
};

export const symbol2description = {
  '>': { text: 'Une entrée' },
  '<': { text: 'Une sortie' },
  '.': { text: ''}
};

export const pnj2dialog = {
  'J': 'La machine à café est cassée!',
  'r': 'Bonjour!',
  'v': 'On ne peut pas sortir sans payer!',
  'c': 'On n\'est pas sensé pouvoir me parler!',
  'm': 'Une pièce?',
  't': 'Ici, c\'est le tutoriel',
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
export const item_symbols: Array<string> = [ '{', '}', '[', ']', '(', ')', '&', '%', '!', '?', '*', '$'];
export const walkable_symbols: Array<string> = [ '.', '<', '>' ];
