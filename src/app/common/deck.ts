
/**
 * Standard 52-card deck
 */

export const SUITS = 'SDCH';

export const SUIT_CHARACTERS: Readonly<string[]> = Array.from(SUITS);
export const SUIT_PLAY_NAMES: Readonly<string[]> = ['♠', '♦', '♣', '♥'];
export const SUIT_FULL_NAMES: Readonly<string[]> = [
  'spades',
  'diamonds',
  'clubs',
  'hearts'
] as const;
export const SUIT_HTML_CODES: Readonly<string[]> = [
  '&spades;',
  '&diams;',
  '&clubs;',
  '&hearts;'
]; // Special Symbol Character Codes for HTML

export const RANKS = 'A23456789TJQK';
export const RANK_CHARACTERS: Readonly<string[]> = Array.from(RANKS);
export const RANK_PLAY_NAMES: Readonly<string[]> = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
];
export const RANK_FULL_NAMES: Readonly<string[]> = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Jack',
  'Queen',
  'King'
];

export const SUIT_NUM = SUITS.length;
export const RANK_NUM = RANKS.length;

// Standard 52-card deck
export const CARD_NUM = SUIT_NUM * RANK_NUM;

// Card index is defined as: suit + rank * SUIT_NUM
export function indexOf(s: number, r: number): number {
  return s + r * SUIT_NUM;
}

export function rankOf(index: number): number {
  return Math.floor(index / SUIT_NUM);
}

export function suitOf(index: number): number {
  return index % SUIT_NUM;
}

// Card names:
export function nameOf(index: number): string {
  return RANKS[rankOf(index)] + SUITS[suitOf(index)];
}

export function playNameOf(index: number): string {
  return RANK_PLAY_NAMES[rankOf(index)] + SUIT_PLAY_NAMES[suitOf(index)];
}

export function fullNameOf(index: number): string {
  return (
    RANK_FULL_NAMES[rankOf(index)] + ' of ' + SUIT_FULL_NAMES[suitOf(index)]
  );
}

// Suit names:
export function suitNameOf(index: number): string {
  return SUITS[suitOf(index)];
}

export function suitPlayNameOf(index: number): string {
  return SUIT_PLAY_NAMES[suitOf(index)];
}

export function suitFullNameOf(index: number) {
  return SUIT_FULL_NAMES[suitOf(index)];
}

export function suitHTMLCodeOf(index: number) {
  return SUIT_HTML_CODES[suitOf(index)];
}

// Rank names:
export function rankNameOf(index: number) {
  return RANKS[rankOf(index)];
}

export function rankPlayNameOf(index: number) {
  return RANK_PLAY_NAMES[rankOf(index)];
}

export function rankFullNameOf(index: number) {
  return RANK_FULL_NAMES[rankOf(index)];
}

// A set of optionally shuffled playing cards.
export function deck(seed?: number): number[] {
  const cards: number[] = [];
  for (let i = 0; i < CARD_NUM; i++) {
    cards[i] = i;
  }
  if (seed >= 0) {
    // use LCG algorithm to pick up cards from the deck
    // http://en.wikipedia.org/wiki/Linear_congruential_generator
    const m = 0x80000000;
    const a = 1103515245;
    const c = 12345;

    for (let i = 0; i < CARD_NUM; i++) {
      seed = (a * seed + c) % m;

      // swap cards
      const j = seed % CARD_NUM;
      if (i !== j) {
        const card = cards[i];
        cards[i] = cards[j];
        cards[j] = card;
      }
    }
  }
  return cards;
}

export function isTableau(cardA: number, cardB: number) {
  return (
    rankOf(cardA) === (rankOf(cardB) + 1) % RANK_NUM &&
    suitOf(cardA) % 2 !== suitOf(cardB) % 2
  );
}
