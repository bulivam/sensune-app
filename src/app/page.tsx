'use client';

import { useState, useEffect, useRef } from 'react';
import { Coins, Sparkles, Gift, ShoppingBag, BookOpen, Lock, Unlock, Star, Trophy, Calendar, RotateCcw, ChevronRight, Award, X, Shield, Send, Check, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { characters, gachaCards, shopPackages } from '@/lib/data';
import { UserProgress, Character, Chapter, GachaCard, ExtraChapter, ChatMessage } from '@/lib/types';
import { 
  loadProgress, 
  unlockCharacter, 
  completeChapter, 
  performCheckIn, 
  rollGacha,
  purchasePackage,
  purchaseExtraChapter,
  resetProgress
} from '@/lib/store';
import { login, register, logout, getCurrentUser, isAdmin, initializeAuth } from '@/lib/auth';

type Screen = 'login' | 'home' | 'character' | 'gacha' | 'collection' | 'collection-detail' | 'checkin' | 'shop' | 'chat';

export default function Sensune() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [gachaResult, setGachaResult] = useState<GachaCard[]>([]);
  const [showGachaResult, setShowGachaResult] = useState(false);
  const [gachaDuplicates, setGachaDuplicates] = useState(0);
  const [notification, setNotification] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionReward, setCompletionReward] = useState({ coins: 0, tickets: 0 });
  const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState(false);
  const [isUsingTicket, setIsUsingTicket] = useState(false);

  // Chat states
  const [chatMessages, setChatMessages] = useState<(ChatMessage & { visible?: boolean })[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [chatProgress, setChatProgress] = useState(0);
  const [unlockedImages, setUnlockedImages] = useState<string[]>([]);
  const [showUnlockImageModal, setShowUnlockImageModal] = useState(false);
  const [imageToUnlock, setImageToUnlock] = useState<string>('');
  const [unlockImageCost, setUnlockImageCost] = useState(100);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<Array<{text: string, nextMessageId: string}>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeAuth();
    const user = getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setIsUserAdmin(isAdmin());
      setProgress(loadProgress());
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping, showChoices]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleLogin = () => {
    setAuthError('');
    const result = login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setIsUserAdmin(isAdmin());
      setProgress(loadProgress());
      showNotification('Login realizado com sucesso!');
    } else {
      setAuthError(result.error || 'Erro ao fazer login');
    }
  };

  const handleRegister = () => {
    setAuthError('');
    const result = register(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setIsUserAdmin(false);
      setProgress(loadProgress());
      showNotification('Conta criada com sucesso!');
    } else {
      setAuthError(result.error || 'Erro ao criar conta');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIsUserAdmin(false);
    setProgress(null);
    setCurrentScreen('home');
    showNotification('Logout realizado!');
  };

  const handleReset = () => {
    const newProgress = resetProgress();
    setProgress(newProgress);
    setShowResetModal(false);
    setCurrentScreen('home');
    showNotification('Progresso resetado com sucesso!');
  };

  const handleUnlockCharacter = (char: Character) => {
    if (!progress) return;
    
    if (progress.unlockedCharacters.includes(char.id)) {
      setSelectedCharacter(char);
      setCurrentScreen('character');
    } else {
      setSelectedCharacter(char);
      setShowUnlockModal(true);
    }
  };

  const confirmUnlock = () => {
    if (!progress || !selectedCharacter) return;
    
    if (progress.coins < selectedCharacter.unlockCost) {
      setShowUnlockModal(false);
      setShowInsufficientCoinsModal(true);
      return;
    }
    
    const newProgress = unlockCharacter(progress, selectedCharacter.id);
    if (newProgress.unlockedCharacters.includes(selectedCharacter.id)) {
      setProgress(newProgress);
      setShowUnlockModal(false);
      setCurrentScreen('character');
      showNotification(`${selectedCharacter.name} desbloqueada!`);
    }
  };

  const handleStartChat = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    const messagesWithVisibility = chapter.chatMessages.map(msg => ({ ...msg, visible: false }));
    setChatMessages(messagesWithVisibility);
    setCurrentMessageIndex(0);
    setChatProgress(0);
    setUnlockedImages([]);
    setShowChoices(false);
    setCurrentChoices([]);
    setCurrentScreen('chat');
    
    // Mostrar primeira mensagem após delay
    setTimeout(() => {
      showNextMessage(0, messagesWithVisibility);
    }, 500);
  };

  const showNextMessage = (index: number, messages: (ChatMessage & { visible?: boolean })[]) => {
    if (index >= messages.length) {
      // Capítulo completo
      handleCompleteChapter(selectedChapter!);
      return;
    }

    const message = messages[index];

    if (message.type === 'character') {
      setIsTyping(true);
      const typingDelay = Math.random() * 500 + 900; // 900-1400ms
      
      setTimeout(() => {
        setIsTyping(false);
        
        // Marcar mensagem como visível
        const updatedMessages = [...messages];
        updatedMessages[index] = { ...updatedMessages[index], visible: true };
        setChatMessages(updatedMessages);
        setCurrentMessageIndex(index + 1);
        
        // Atualizar progresso
        const newProgress = Math.min(100, ((index + 1) / messages.length) * 100);
        setChatProgress(newProgress);
        
        // Se tem imageUnlock, desbloquear imagem
        if (message.imageUnlock && selectedChapter) {
          setUnlockedImages(prev => [...prev, selectedChapter.imageUrl]);
          showNotification('🎉 Nova imagem desbloqueada!');
        }
        
        // Verificar se próxima mensagem é choice
        if (index + 1 < messages.length && messages[index + 1].type === 'choice') {
          // Mostrar choices após delay
          setTimeout(() => {
            const choiceMessage = messages[index + 1];
            if (choiceMessage.choices) {
              setCurrentChoices(choiceMessage.choices);
              setShowChoices(true);
              
              // Marcar mensagem de choice como processada
              const updatedWithChoice = [...updatedMessages];
              updatedWithChoice[index + 1] = { ...updatedWithChoice[index + 1], visible: true };
              setChatMessages(updatedWithChoice);
              setCurrentMessageIndex(index + 2);
            }
          }, 800);
        } else if (index + 1 < messages.length) {
          // Continuar para próxima mensagem normalmente
          setTimeout(() => showNextMessage(index + 1, updatedMessages), 800);
        }
      }, typingDelay);
    } else if (message.type === 'choice') {
      // Choices são tratadas no bloco anterior
      return;
    }
  };

  const handleChoice = (choiceText: string, nextMessageId: string) => {
    // Esconder choices
    setShowChoices(false);
    
    // Adicionar mensagem do usuário
    const userMessage: ChatMessage & { visible: boolean } = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: choiceText,
      visible: true
    };
    
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    
    // Encontrar próxima mensagem
    const nextIndex = chatMessages.findIndex(m => m.id === nextMessageId);
    if (nextIndex !== -1) {
      setTimeout(() => {
        showNextMessage(nextIndex, updatedMessages);
      }, 1500); // 1.5s delay
    }
  };

  const handleUnlockImageNow = () => {
    if (!progress || !selectedChapter) return;
    
    setImageToUnlock(selectedChapter.imageUrl);
    setShowUnlockImageModal(true);
  };

  const confirmUnlockImage = () => {
    if (!progress) return;
    
    if (progress.coins < unlockImageCost) {
      setShowUnlockImageModal(false);
      setShowInsufficientCoinsModal(true);
      return;
    }
    
    const newProgress = {
      ...progress,
      coins: progress.coins - unlockImageCost
    };
    setProgress(newProgress);
    setUnlockedImages(prev => [...prev, imageToUnlock]);
    setShowUnlockImageModal(false);
    showNotification(`Imagem desbloqueada por ${unlockImageCost} moedas!`);
  };

  const handleCompleteChapter = (chapter: Chapter) => {
    if (!progress || !selectedCharacter) return;
    
    const newProgress = completeChapter(progress, chapter.id);
    setProgress(newProgress);
    
    let message = `✅ Capítulo completado! +${chapter.reward.coins} moedas`;
    
    if (chapter.reward.gachaTicket) {
      message += ' +1 ticket de gacha';
    }
    
    if (newProgress.completedCharacters.includes(selectedCharacter.id) && 
        !progress.completedCharacters.includes(selectedCharacter.id)) {
      setCompletionReward({ coins: 50, tickets: 1 });
      setShowCompletionModal(true);
    }
    
    showNotification(message);
    
    // Animação de moedas voando
    setTimeout(() => {
      setCurrentScreen('character');
    }, 2000);
  };

  const handlePurchaseExtra = (extra: ExtraChapter) => {
    if (!progress || !selectedCharacter) return;
    
    if (progress.coins < extra.cost) {
      setShowInsufficientCoinsModal(true);
      return;
    }
    
    const newProgress = purchaseExtraChapter(progress, extra.id);
    
    if (newProgress.purchasedExtraChapters.includes(extra.id)) {
      setProgress(newProgress);
      showNotification(`Capítulo extra desbloqueado!`);
      
      if (newProgress.completedCharacters.includes(selectedCharacter.id) && 
          !progress.completedCharacters.includes(selectedCharacter.id)) {
        setCompletionReward({ coins: 50, tickets: 1 });
        setShowCompletionModal(true);
      }
    }
  };

  const handleCheckIn = () => {
    if (!progress) return;
    
    const result = performCheckIn(progress);
    setProgress(result.progress);
    showNotification(result.message);
  };

  const handleGacha = (times: number) => {
    if (!progress) return;
    
    const cost = times === 1 ? 150 : 1350;
    const hasTickets = progress.gachaTickets >= times;
    const hasEnoughCoins = progress.coins >= cost;
    const hasPartialTickets = progress.gachaTickets > 0 && progress.gachaTickets < times;
    
    if (!hasTickets && !hasEnoughCoins && !hasPartialTickets) {
      setShowInsufficientCoinsModal(true);
      return;
    }
    
    if (progress.gachaTickets > 0) {
      setIsUsingTicket(true);
      setTimeout(() => setIsUsingTicket(false), 1000);
    }
    
    const result = rollGacha(progress, times);
    if (result.success) {
      setProgress(result.progress);
      setGachaResult(result.cards);
      setGachaDuplicates(result.duplicates);
      setShowGachaResult(true);
      showNotification(result.message);
    } else {
      setShowInsufficientCoinsModal(true);
    }
  };

  const handlePurchase = (coins: number) => {
    if (!progress) return;
    
    const newProgress = purchasePackage(progress, coins);
    setProgress(newProgress);
    showNotification(`Você comprou ${coins} moedas!`);
  };

  const getCharacterProgress = (characterId: string) => {
    if (!progress) return { collected: 0, total: 0, percentage: 0 };
    
    const character = characters.find(c => c.id === characterId);
    if (!character) return { collected: 0, total: 0, percentage: 0 };
    
    const storyCollected = character.chapters.filter(ch => 
      progress.completedChapters.includes(ch.id)
    ).length;
    
    const extraCollected = character.extraChapters.filter(ex => 
      progress.purchasedExtraChapters.includes(ex.id)
    ).length;
    
    const gachaCollected = gachaCards.filter(card => 
      card.characterId === characterId && 
      progress.collectedGachaCards.includes(card.id)
    ).length;
    
    const collected = storyCollected + extraCollected + gachaCollected;
    const total = character.chapters.length + character.extraChapters.length + 4;
    const percentage = Math.round((collected / total) * 100);
    
    return { collected, total, percentage };
  };

  const openCollectionDetail = (char: Character) => {
    setSelectedCharacter(char);
    setCurrentScreen('collection-detail');
  };

  // Tela de Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-pink-500/30">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent text-center mb-8">
            Sensune
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {authError}
              </div>
            )}

            <button
              onClick={isLoginMode ? handleLogin : handleRegister}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 rounded-full font-bold transition-all"
            >
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </button>

            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setAuthError('');
              }}
              className="w-full text-pink-400 hover:text-pink-300 text-sm transition-colors"
            >
              {isLoginMode ? 'Criar conta' : 'Já tenho conta'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center mb-2">Conta de teste:</p>
              <p className="text-xs text-gray-400 text-center">admin@sensune.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-pink-500 text-2xl font-bold animate-pulse">Carregando Sensune...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-pink-500/20 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Sensune
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-400">{progress.coins}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-purple-400">{progress.gachaTickets}</span>
            </div>
            {isUserAdmin && (
              <a
                href="/admin"
                className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                title="Painel Admin"
              >
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-blue-400">Admin</span>
              </a>
            )}
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30 hover:bg-red-500/30 transition-all"
              title="Resetar progresso"
            >
              <RotateCcw className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce max-w-md text-center">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 pb-24">


        {currentScreen === 'chat' && selectedChapter && selectedCharacter && (
          <div className="max-w-2xl mx-auto">
            {/* Chat Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-2xl p-4 border-2 border-pink-500/30 border-b-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCharacter.chapters[0].imageUrl}
                  alt={selectedCharacter.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{selectedCharacter.name}</h3>
                  <p className="text-xs text-gray-400">{selectedChapter.title}</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentScreen('character')}
                className="text-pink-500 hover:text-pink-400 transition-colors"
                title="Sair do chat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-black/30 border-2 border-pink-500/30 border-t-0 border-b-0 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Progresso do capítulo</span>
                <span className="text-pink-400 font-bold">{Math.round(chatProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${chatProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="bg-black/30 border-2 border-pink-500/30 border-t-0 border-b-0 p-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4"
            >
              {chatMessages.filter(msg => msg.visible && msg.type !== 'choice').map((msg, index) => {
                if (msg.type === 'character') {
                  return (
                    <div key={index} className="flex items-start gap-3 animate-fadeIn">
                      <img
                        src={selectedCharacter.chapters[0].imageUrl}
                        alt={selectedCharacter.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="bg-pink-500/20 border border-pink-500/30 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                        <p className="text-sm">{msg.content}</p>
                        {msg.imageUnlock && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                            <ImageIcon className="w-3 h-3" />
                            <span>Imagem desbloqueada!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else if (msg.type === 'user') {
                  return (
                    <div key={index} className="flex items-start gap-3 justify-end animate-fadeIn">
                      <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}

              {isTyping && (
                <div className="flex items-start gap-3 animate-fadeIn">
                  <img
                    src={selectedCharacter.chapters[0].imageUrl}
                    alt={selectedCharacter.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-pink-500/20 border border-pink-500/30 rounded-2xl rounded-tl-none px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {showChoices && currentChoices.length > 0 && (
                <div className="flex flex-col gap-3 items-end animate-fadeIn">
                  {currentChoices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice.text, choice.nextMessageId)}
                      className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-500/50 hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-400 rounded-2xl px-5 py-3 max-w-[85%] transition-all hover:scale-105 text-sm font-medium shadow-lg hover:shadow-purple-500/50"
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Footer */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-b-2xl p-4 border-2 border-pink-500/30 border-t-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Continue lendo para desbloquear imagens</span>
                </div>
                {chatProgress < 100 && chatProgress > 20 && !showChoices && (
                  <button
                    onClick={handleUnlockImageNow}
                    className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full hover:bg-yellow-500/30 transition-all flex items-center gap-1"
                  >
                    <Coins className="w-3 h-3" />
                    Desbloquear agora
                  </button>
                )}
              </div>
            </div>

            {/* Unlocked Images Preview */}
            {unlockedImages.length > 0 && (
              <div className="mt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-green-500/30 animate-fadeIn">
                <h4 className="font-bold mb-3 text-green-400 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Imagens Desbloqueadas
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {unlockedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Desbloqueada"
                      className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-green-500/50"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Image Preview (Blurred) */}
            {chatProgress > 0 && chatProgress < 100 && unlockedImages.length === 0 && (
              <div className="mt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-gray-700/30">
                <div className="relative">
                  <img
                    src={selectedChapter.imageUrl}
                    alt="Preview"
                    className="w-full aspect-[3/4] object-cover rounded-lg blur-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Será desbloqueada em {Math.round(100 - chatProgress)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentScreen === 'home' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Personagens</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {characters.map((char) => {
                const isUnlocked = progress.unlockedCharacters.includes(char.id);
                return (
                  <button
                    key={char.id}
                    onClick={() => handleUnlockCharacter(char)}
                    className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 border-pink-500/30 hover:border-pink-500 transition-all hover:scale-105"
                  >
                    <div className="aspect-[3/4] relative">
                      <img
                        src={char.chapters[0].imageUrl}
                        alt={char.name}
                        className={`w-full h-full object-cover ${!isUnlocked ? 'blur-xl' : ''}`}
                      />
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Lock className="w-12 h-12 text-pink-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-black/50">
                      <h3 className="font-bold text-lg">{char.name}</h3>
                      <p className="text-xs text-gray-400">{char.style}</p>
                      <div className="mt-2 flex items-center justify-between">
                        {isUnlocked ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                            <Unlock className="w-3 h-3" />
                            Liberada
                          </span>
                        ) : (
                          <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {char.unlockCost} moedas
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentScreen === 'character' && selectedCharacter && (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="text-pink-500 hover:text-pink-400 flex items-center gap-2"
            >
              ← Voltar
            </button>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-pink-500/30">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedCharacter.chapters[0].imageUrl}
                  alt={selectedCharacter.name}
                  className="w-full md:w-64 h-80 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedCharacter.name}</h2>
                  <p className="text-pink-400 mb-4">{selectedCharacter.personality}</p>
                  <p className="text-gray-300 mb-4">{selectedCharacter.description}</p>
                  <div className="bg-black/30 p-4 rounded-xl">
                    <h3 className="font-bold mb-2">História:</h3>
                    <p className="text-sm text-gray-400">{selectedCharacter.lore}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Capítulos</h3>
              {selectedCharacter.chapters.map((chapter, index) => {
                const isCompleted = progress.completedChapters.includes(chapter.id);
                const isUnlocked = index === 0 || progress.completedChapters.includes(selectedCharacter.chapters[index - 1].id);
                
                return (
                  <div
                    key={chapter.id}
                    className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 ${
                      isCompleted ? 'border-green-500/30' : isUnlocked ? 'border-pink-500/30' : 'border-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={chapter.imageUrl}
                        alt={chapter.title}
                        className={`w-20 h-28 object-cover rounded-lg ${!isUnlocked ? 'blur-sm' : ''}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold">
                            Capítulo {chapter.number}: {chapter.title}
                          </h4>
                          {chapter.isFinal && (
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                              Final
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{chapter.content}</p>
                        {isCompleted ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                            <Trophy className="w-3 h-3" />
                            Completado
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleStartChat(chapter)}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-4 py-2 rounded-full text-sm font-bold transition-all"
                          >
                            Ler Capítulo
                          </button>
                        ) : (
                          <span className="text-xs bg-gray-700/50 text-gray-500 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                            <Lock className="w-3 h-3" />
                            Bloqueado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCharacter.extraChapters.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Capítulos Extras
                </h3>
                {selectedCharacter.extraChapters.map((extra) => {
                  const isPurchased = progress.purchasedExtraChapters.includes(extra.id);
                  
                  return (
                    <div
                      key={extra.id}
                      className={`bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-4 border-2 ${
                        isPurchased ? 'border-green-500/30' : 'border-yellow-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={extra.imageUrl}
                          alt={extra.title}
                          className={`w-20 h-28 object-cover rounded-lg ${!isPurchased ? 'blur-sm' : ''}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                              Extra
                            </span>
                            <h4 className="font-bold">{extra.title}</h4>
                          </div>
                          <p className="text-xs text-yellow-400 mb-2">{extra.theme}</p>
                          <p className="text-sm text-gray-400 mb-3">{extra.content}</p>
                          {isPurchased ? (
                            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                              <Trophy className="w-3 h-3" />
                              Desbloqueado
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePurchaseExtra(extra)}
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2"
                            >
                              <Coins className="w-4 h-4" />
                              Desbloquear ({extra.cost} moedas)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentScreen === 'gacha' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Sistema Gacha</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border-2 border-purple-500/30">
                <div className="text-center mb-6">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Roleta de Figurinhas</h3>
                  <p className="text-gray-400">Colecione figurinhas exclusivas das personagens!</p>
                </div>
                
                {isUsingTicket && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
                    <div className="animate-[spin_0.5s_ease-in-out] scale-150">
                      <Star className="w-32 h-32 text-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]" />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleGacha(1)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-6 rounded-xl font-bold text-lg transition-all hover:scale-105"
                  >
                    <div className="text-2xl mb-2">🎰</div>
                    Rodar 1x
                    <div className="text-sm mt-2 opacity-80">
                      {progress.gachaTickets > 0 ? '1 ticket' : '150 moedas'}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleGacha(10)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 p-6 rounded-xl font-bold text-lg transition-all hover:scale-105"
                  >
                    <div className="text-2xl mb-2">🎰✨</div>
                    Rodar 10x
                    <div className="text-sm mt-2 opacity-80">
                      {progress.gachaTickets >= 10 ? '10 tickets' : 
                       progress.gachaTickets > 0 ? `${progress.gachaTickets} tickets + ${(10 - progress.gachaTickets) * 150} moedas` :
                       '1350 moedas'}
                    </div>
                  </button>
                </div>

                <div className="mt-6 bg-black/30 p-4 rounded-xl">
                  <h4 className="font-bold mb-2">Raridades:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span>Comum - 50%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span>Raro - 30%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span>Épico - 15%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Lendário - 5%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">* Duplicatas são convertidas em 75 moedas</p>
                  <p className="text-xs text-purple-400 mt-2">* Tickets são usados automaticamente primeiro!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'collection' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Colecionáveis</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {characters.filter(char => progress.unlockedCharacters.includes(char.id)).map((char) => {
                const charProgress = getCharacterProgress(char.id);
                const isCompleted = progress.completedCharacters.includes(char.id);
                
                return (
                  <button
                    key={char.id}
                    onClick={() => openCollectionDetail(char)}
                    className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500 transition-all hover:scale-105"
                  >
                    <div className="aspect-[3/4] relative">
                      <img
                        src={char.chapters[0].imageUrl}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                      {isCompleted && (
                        <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-2">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-black/50">
                      <h3 className="font-bold text-lg">{char.name}</h3>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">{charProgress.collected} / {charProgress.total}</span>
                          <span className="text-purple-400 font-bold">{charProgress.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${charProgress.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-1 text-purple-400">
                        <span className="text-xs">Ver coleção</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {progress.unlockedCharacters.length === 0 && (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Desbloqueie personagens para ver suas coleções!</p>
              </div>
            )}
          </div>
        )}

        {currentScreen === 'collection-detail' && selectedCharacter && (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentScreen('collection')}
              className="text-pink-500 hover:text-pink-400 flex items-center gap-2"
            >
              ← Voltar
            </button>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-purple-500/30">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedCharacter.chapters[0].imageUrl}
                  alt={selectedCharacter.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-400">
                      {getCharacterProgress(selectedCharacter.id).collected} / {getCharacterProgress(selectedCharacter.id).total} imagens
                    </span>
                    <span className="text-sm text-purple-400 font-bold">
                      ({getCharacterProgress(selectedCharacter.id).percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                      style={{ width: `${getCharacterProgress(selectedCharacter.id).percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-pink-400" />
                História
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {selectedCharacter.chapters.map(chapter => {
                  const isCollected = progress.completedChapters.includes(chapter.id);
                  return (
                    <div
                      key={chapter.id}
                      className={`aspect-[3/4] rounded-lg overflow-hidden border-2 ${
                        isCollected ? 'border-green-500/50' : 'border-gray-700/50'
                      }`}
                    >
                      <img
                        src={chapter.imageUrl}
                        alt={chapter.title}
                        className={`w-full h-full object-cover ${!isCollected ? 'blur-xl grayscale' : ''}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedCharacter.extraChapters.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Extras
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                  {selectedCharacter.extraChapters.map(extra => {
                    const isCollected = progress.purchasedExtraChapters.includes(extra.id);
                    return (
                      <div
                        key={extra.id}
                        className={`aspect-[3/4] rounded-lg overflow-hidden border-2 ${
                          isCollected ? 'border-yellow-500/50' : 'border-gray-700/50'
                        }`}
                      >
                        <img
                          src={extra.imageUrl}
                          alt={extra.title}
                          className={`w-full h-full object-cover ${!isCollected ? 'blur-xl grayscale' : ''}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Gacha
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {gachaCards.filter(card => card.characterId === selectedCharacter.id).map(card => {
                  const isCollected = progress.collectedGachaCards.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      className={`aspect-[3/4] rounded-lg overflow-hidden border-2 ${
                        isCollected ? 'border-purple-500/50' : 'border-gray-700/50'
                      }`}
                    >
                      <img
                        src={card.imageUrl}
                        alt={card.characterName}
                        className={`w-full h-full object-cover ${!isCollected ? 'blur-xl grayscale' : ''}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'checkin' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Check-in Diário</h2>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-pink-500/30 text-center">
              <Calendar className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Recompensas Diárias</h3>
              <p className="text-gray-400 mb-6">Faça check-in todos os dias para ganhar moedas e prêmios!</p>
              
              <div className="bg-black/30 p-6 rounded-xl mb-6">
                <div className="text-4xl font-bold text-pink-500 mb-2">
                  Dia {progress.checkInStreak}/7
                </div>
                <p className="text-sm text-gray-400">
                  {progress.checkInStreak === 0 ? 'Comece sua sequência hoje!' : 'Continue sua sequência!'}
                </p>
              </div>

              <button
                onClick={handleCheckIn}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 w-full"
              >
                Fazer Check-in (+10 moedas)
              </button>

              <div className="mt-6 grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold ${
                      day <= progress.checkInStreak
                        ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                        : 'bg-gray-700/30 text-gray-500 border-2 border-gray-700'
                    }`}
                  >
                    {day === 7 ? '🎁' : day}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Complete 7 dias para ganhar 1 ticket de gacha!</p>
            </div>
          </div>
        )}

        {currentScreen === 'shop' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Loja de Moedas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopPackages.map(pack => (
                <div
                  key={pack.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:scale-105"
                >
                  <div className="text-center">
                    <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {pack.coins}
                    </div>
                    <div className="text-sm text-gray-400 mb-4">moedas</div>
                    <div className="text-2xl font-bold text-pink-500 mb-4">
                      {pack.price}
                    </div>
                    <button
                      onClick={() => handlePurchase(pack.coins)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-full font-bold transition-all w-full"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50 text-center text-sm text-gray-400">
              💡 Esta é uma simulação. Em produção, seria integrado com gateway de pagamento real.
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-pink-500/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-around">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'home' ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Personagens</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('gacha')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'gacha' ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-medium">Gacha</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('collection')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'collection' || currentScreen === 'collection-detail' ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Colecionáveis</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('checkin')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'checkin' ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Gift className="w-6 h-6" />
            <span className="text-xs font-medium">Check-in</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('shop')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'shop' ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs font-medium">Loja</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showUnlockImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-yellow-500/30">
            <div className="text-center mb-6">
              <ImageIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Desbloquear Imagem</h3>
              <p className="text-gray-400">
                Deseja desbloquear esta imagem agora por <span className="font-bold text-yellow-400">{unlockImageCost} moedas</span>?
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={confirmUnlockImage}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Desbloquear por {unlockImageCost} moedas
              </button>
              <button
                onClick={() => setShowUnlockImageModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showInsufficientCoinsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-orange-500/30">
            <div className="text-center mb-6">
              <Coins className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Moedas insuficientes</h3>
              <p className="text-gray-400">
                Você não tem moedas suficientes para realizar esta ação.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowInsufficientCoinsModal(false);
                  setCurrentScreen('shop');
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Recarregar moedas
              </button>
              <button
                onClick={() => {
                  setShowInsufficientCoinsModal(false);
                  setCurrentScreen('checkin');
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Ganhar moedas
              </button>
              <button
                onClick={() => setShowInsufficientCoinsModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-2xl p-8 max-w-md w-full border-2 border-yellow-500/50">
            <div className="text-center">
              <Award className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-bold mb-4 text-yellow-400">Personagem Completo!</h3>
              <p className="text-gray-300 mb-6">
                Parabéns! Você completou 100% de {selectedCharacter?.name}!
              </p>
              <div className="bg-black/30 p-6 rounded-xl mb-6">
                <p className="text-2xl font-bold text-yellow-400 mb-2">Recompensa:</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-6 h-6 text-yellow-400" />
                    <span className="text-xl font-bold">+{completionReward.coins}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-purple-400" />
                    <span className="text-xl font-bold">+{completionReward.tickets}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-red-500/30">
            <div className="text-center mb-6">
              <RotateCcw className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Resetar Progresso</h3>
              <p className="text-gray-400">
                Tem certeza que deseja resetar todo o seu progresso? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-full font-bold transition-all"
              >
                Sim, resetar tudo
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnlockModal && selectedCharacter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-pink-500/30">
            <h3 className="text-2xl font-bold mb-4 text-center">Desbloquear Personagem</h3>
            <img
              src={selectedCharacter.chapters[0].imageUrl}
              alt={selectedCharacter.name}
              className="w-full h-64 object-cover rounded-xl mb-4 blur-sm"
            />
            <p className="text-center mb-6">
              Deseja desbloquear <span className="font-bold text-pink-500">{selectedCharacter.name}</span> por{' '}
              <span className="font-bold text-yellow-400">{selectedCharacter.unlockCost} moedas</span>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUnlockModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUnlock}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {showGachaResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full border-2 border-purple-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Você ganhou!</h3>
              <button
                onClick={() => setShowGachaResult(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {gachaDuplicates > 0 && (
              <div className="mb-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
                <p className="text-yellow-400 font-bold">
                  🔄 {gachaDuplicates} figurinha(s) repetida(s) convertida(s) em {gachaDuplicates * 75} moedas!
                </p>
              </div>
            )}
            
            {gachaResult.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {gachaResult.map(card => (
                  <div key={card.id} className="text-center">
                    <img
                      src={card.imageUrl}
                      alt={card.characterName}
                      className="w-full aspect-[3/4] object-cover rounded-lg mb-2"
                    />
                    <p className="text-xs font-bold">{card.characterName}</p>
                    <p className={`text-xs ${ 
                      card.rarity === 'lendário' ? 'text-yellow-400' :
                      card.rarity === 'épico' ? 'text-purple-400' :
                      card.rarity === 'raro' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {card.rarity}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Todas as figurinhas eram duplicatas!</p>
                <p className="text-sm mt-2">Você ganhou {gachaDuplicates * 75} moedas.</p>
              </div>
            )}
            
            <button
              onClick={() => setShowGachaResult(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 rounded-full font-bold transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
