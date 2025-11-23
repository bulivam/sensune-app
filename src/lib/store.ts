import { UserProgress, GachaCard, Rarity } from './types';
import { characters, gachaCards } from './data';

const STORAGE_KEY = 'sensune_progress';

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultProgress = getDefaultProgress();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
  return defaultProgress;
}

function getDefaultProgress(): UserProgress {
  // Pegar userId do usuário logado
  const currentUserData = typeof window !== 'undefined' ? localStorage.getItem('sensune_current_user') : null;
  const userId = currentUserData ? JSON.parse(currentUserData).id : 'guest';
  
  return {
    userId,
    coins: 200,
    gachaTickets: 1,
    unlockedCharacters: [],
    completedChapters: [],
    completedCharacters: [],
    purchasedExtraChapters: [],
    collectedGachaCards: [],
    checkInStreak: 0,
    lastCheckIn: null,
  };
}

function saveProgress(progress: UserProgress) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function unlockCharacter(progress: UserProgress, characterId: string): UserProgress {
  const character = characters.find(c => c.id === characterId);
  if (!character || progress.unlockedCharacters.includes(characterId)) {
    return progress;
  }

  if (progress.coins < character.unlockCost) {
    return progress;
  }

  const newProgress = {
    ...progress,
    coins: progress.coins - character.unlockCost,
    unlockedCharacters: [...progress.unlockedCharacters, characterId],
  };

  saveProgress(newProgress);
  return newProgress;
}

export function completeChapter(progress: UserProgress, chapterId: string): UserProgress {
  if (progress.completedChapters.includes(chapterId)) {
    return progress;
  }

  const character = characters.find(c => 
    c.chapters.some(ch => ch.id === chapterId)
  );

  if (!character) return progress;

  const chapter = character.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return progress;

  const newProgress = {
    ...progress,
    completedChapters: [...progress.completedChapters, chapterId],
    coins: progress.coins + chapter.reward.coins,
    gachaTickets: progress.gachaTickets + (chapter.reward.gachaTicket ? 1 : 0),
  };

  // Verificar se completou todos os capítulos + extras do personagem
  const allChapterIds = character.chapters.map(ch => ch.id);
  const allExtraIds = character.extraChapters.map(ex => ex.id);
  const allCompleted = 
    allChapterIds.every(id => newProgress.completedChapters.includes(id)) &&
    allExtraIds.every(id => newProgress.purchasedExtraChapters.includes(id));

  if (allCompleted && !progress.completedCharacters.includes(character.id)) {
    newProgress.completedCharacters = [...newProgress.completedCharacters, character.id];
    newProgress.coins += 50;
    newProgress.gachaTickets += 1;
  }

  saveProgress(newProgress);
  return newProgress;
}

export function purchaseExtraChapter(progress: UserProgress, extraId: string): UserProgress {
  if (progress.purchasedExtraChapters.includes(extraId)) {
    return progress;
  }

  const character = characters.find(c => 
    c.extraChapters.some(ex => ex.id === extraId)
  );

  if (!character) return progress;

  const extra = character.extraChapters.find(ex => ex.id === extraId);
  if (!extra) return progress;

  if (progress.coins < extra.cost) {
    return progress;
  }

  const newProgress = {
    ...progress,
    coins: progress.coins - extra.cost,
    purchasedExtraChapters: [...progress.purchasedExtraChapters, extraId],
  };

  // Verificar se completou todos os capítulos + extras do personagem
  const allChapterIds = character.chapters.map(ch => ch.id);
  const allExtraIds = character.extraChapters.map(ex => ex.id);
  const allCompleted = 
    allChapterIds.every(id => newProgress.completedChapters.includes(id)) &&
    allExtraIds.every(id => newProgress.purchasedExtraChapters.includes(id));

  if (allCompleted && !progress.completedCharacters.includes(character.id)) {
    newProgress.completedCharacters = [...newProgress.completedCharacters, character.id];
    newProgress.coins += 50;
    newProgress.gachaTickets += 1;
  }

  saveProgress(newProgress);
  return newProgress;
}

export function performCheckIn(progress: UserProgress): { progress: UserProgress; message: string } {
  const today = new Date().toDateString();

  if (progress.lastCheckIn === today) {
    return {
      progress,
      message: 'Você já fez o check-in hoje!',
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = progress.lastCheckIn === yesterday.toDateString();

  let newStreak = wasYesterday ? progress.checkInStreak + 1 : 1;
  let bonusTicket = 0;

  if (newStreak === 7) {
    bonusTicket = 1;
    newStreak = 0;
  }

  const newProgress = {
    ...progress,
    coins: progress.coins + 10,
    gachaTickets: progress.gachaTickets + bonusTicket,
    checkInStreak: newStreak,
    lastCheckIn: today,
  };

  saveProgress(newProgress);

  let message = 'Check-in realizado! +10 moedas';
  if (bonusTicket > 0) {
    message += ' +1 ticket de gacha (7 dias completos!)';
  }

  return { progress: newProgress, message };
}

export function rollGacha(progress: UserProgress, times: number): {
  success: boolean;
  progress: UserProgress;
  cards: GachaCard[];
  duplicates: number;
  message: string;
} {
  const cost = times === 1 ? 150 : 1350;
  
  // Calcular quantos tickets usar
  const ticketsToUse = Math.min(progress.gachaTickets, times);
  const rollsWithTickets = ticketsToUse;
  const rollsWithCoins = times - ticketsToUse;
  const coinCost = rollsWithCoins * 150;

  // Verificar se tem recursos suficientes
  if (progress.coins < coinCost) {
    return {
      success: false,
      progress,
      cards: [],
      duplicates: 0,
      message: 'Moedas insuficientes!',
    };
  }

  const newCards: GachaCard[] = [];
  let duplicates = 0;

  for (let i = 0; i < times; i++) {
    const rarity = getRandomRarity();
    const availableCards = gachaCards.filter(c => c.rarity === rarity);
    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

    if (progress.collectedGachaCards.includes(randomCard.id)) {
      duplicates++;
    } else {
      newCards.push(randomCard);
    }
  }

  const newProgress = {
    ...progress,
    coins: progress.coins - coinCost + (duplicates * 75),
    gachaTickets: progress.gachaTickets - ticketsToUse,
    collectedGachaCards: [
      ...progress.collectedGachaCards,
      ...newCards.map(c => c.id),
    ],
  };

  saveProgress(newProgress);

  let message = `Você ganhou ${newCards.length} figurinha(s)!`;
  if (duplicates > 0) {
    message += ` ${duplicates} duplicata(s) convertida(s) em ${duplicates * 75} moedas!`;
  }
  if (ticketsToUse > 0) {
    message = `Usou ${ticketsToUse} ticket(s)! ` + message;
  }

  return {
    success: true,
    progress: newProgress,
    cards: newCards,
    duplicates,
    message,
  };
}

function getRandomRarity(): Rarity {
  const rand = Math.random() * 100;
  if (rand < 5) return 'lendário';
  if (rand < 20) return 'épico';
  if (rand < 50) return 'raro';
  return 'comum';
}

export function purchasePackage(progress: UserProgress, coins: number): UserProgress {
  const newProgress = {
    ...progress,
    coins: progress.coins + coins,
  };

  saveProgress(newProgress);
  return newProgress;
}

export function resetProgress(): UserProgress {
  const defaultProgress = getDefaultProgress();
  saveProgress(defaultProgress);
  return defaultProgress;
}
