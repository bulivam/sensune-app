// Types para o Sensune

export type SensualityLevel = 'média' | 'alta' | 'muito alta';
export type Rarity = 'comum' | 'raro' | 'épico' | 'lendário';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  imageUrl: string;
  isFinal: boolean;
  reward: {
    coins: number;
    gachaTicket?: boolean;
  };
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  type: 'character' | 'user' | 'choice';
  content?: string;
  choices?: {
    id: string;
    text: string;
    nextMessageId: string;
  }[];
  imageUnlock?: boolean;
  isTyping?: boolean;
}

export interface ExtraChapter {
  id: string;
  title: string;
  theme: string;
  content: string;
  imageUrl: string;
  cost: number;
  chatMessages: ChatMessage[];
}

export interface Character {
  id: string;
  name: string;
  style: string;
  personality: string;
  sensuality: SensualityLevel;
  description: string;
  lore: string;
  unlockCost: number;
  chapters: Chapter[];
  extraChapters: ExtraChapter[];
}

export interface GachaCard {
  id: string;
  characterId: string;
  characterName: string;
  imageUrl: string;
  rarity: Rarity;
}

export interface ShopPackage {
  id: string;
  coins: number;
  price: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface UserProgress {
  userId: string;
  coins: number;
  gachaTickets: number;
  unlockedCharacters: string[];
  completedChapters: string[];
  completedCharacters: string[];
  purchasedExtraChapters: string[];
  collectedGachaCards: string[];
  checkInStreak: number;
  lastCheckIn: string | null;
}
