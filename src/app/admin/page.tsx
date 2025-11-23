'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Gift, 
  ShoppingBag, 
  Calendar,
  FileText,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Upload,
  Settings,
  Download,
  X,
  Check,
  Lock,
  Unlock,
  Copy,
  AlertCircle
} from 'lucide-react';

type AdminScreen = 
  | 'dashboard' 
  | 'characters' 
  | 'chapters' 
  | 'dialogue' 
  | 'gacha' 
  | 'collectibles'
  | 'checkin' 
  | 'shop' 
  | 'users' 
  | 'extras' 
  | 'logs';

export default function AdminPanel() {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('dashboard');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [notification, setNotification] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const confirmDelete = (itemName: string, onConfirm: () => void) => {
    setConfirmAction({
      title: 'Confirmar Exclusão',
      message: `Digite CONFIRMAR para excluir "${itemName}"`,
      onConfirm
    });
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-blue-500/20 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </a>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Painel Admin - Sensune
            </h1>
          </div>
          <div className="bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
            <p className="text-sm text-yellow-400">⚠️ Somente funções administrativas</p>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
          {notification}
        </div>
      )}

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-black/30 border-r border-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'dashboard'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentScreen('characters')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'characters'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Personagens</span>
            </button>

            <button
              onClick={() => setCurrentScreen('chapters')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'chapters'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Capítulos & Extras</span>
            </button>

            <button
              onClick={() => setCurrentScreen('dialogue')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'dialogue'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Chat / Leitura</span>
            </button>

            <button
              onClick={() => setCurrentScreen('gacha')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'gacha'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Gacha</span>
            </button>

            <button
              onClick={() => setCurrentScreen('collectibles')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'collectibles'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Image className="w-5 h-5" />
              <span className="font-medium">Colecionáveis</span>
            </button>

            <button
              onClick={() => setCurrentScreen('checkin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'checkin'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="font-medium">Check-in</span>
            </button>

            <button
              onClick={() => setCurrentScreen('shop')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'shop'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Loja (moedas)</span>
            </button>

            <button
              onClick={() => setCurrentScreen('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'users'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Transações / Logs</span>
            </button>

            <button
              onClick={() => setCurrentScreen('extras')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentScreen === 'extras'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Preview como usuário</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentScreen === 'dashboard' && <DashboardScreen />}
          {currentScreen === 'characters' && <CharactersScreen showNotification={showNotification} confirmDelete={confirmDelete} />}
          {currentScreen === 'chapters' && <ChaptersScreen showNotification={showNotification} confirmDelete={confirmDelete} />}
          {currentScreen === 'dialogue' && <DialogueScreen showNotification={showNotification} />}
          {currentScreen === 'gacha' && <GachaScreen showNotification={showNotification} confirmDelete={confirmDelete} />}
          {currentScreen === 'collectibles' && <CollectiblesScreen />}
          {currentScreen === 'checkin' && <CheckinScreen showNotification={showNotification} />}
          {currentScreen === 'shop' && <ShopScreen showNotification={showNotification} confirmDelete={confirmDelete} />}
          {currentScreen === 'users' && <UsersScreen showNotification={showNotification} />}
          {currentScreen === 'extras' && <ExtrasScreen />}
        </main>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-red-500/30">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-center">{confirmAction.title}</h3>
            <p className="text-gray-400 mb-6 text-center">{confirmAction.message}</p>
            <input
              type="text"
              placeholder="Digite CONFIRMAR"
              className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value === 'CONFIRMAR') {
                  confirmAction.onConfirm();
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }
              }}
            />
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Digite CONFIRMAR"]') as HTMLInputElement;
                  if (input?.value === 'CONFIRMAR') {
                    confirmAction.onConfirm();
                    setShowConfirmModal(false);
                    setConfirmAction(null);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-full font-bold transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// A) Dashboard Admin
function DashboardScreen() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-500/30">
          <h3 className="text-sm text-gray-400 mb-2">Moedas Geradas (Total)</h3>
          <p className="text-4xl font-bold text-yellow-400">125,450</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-green-500/30">
          <h3 className="text-sm text-gray-400 mb-2">Vendas Realizadas</h3>
          <p className="text-4xl font-bold text-green-400">R$ 2.340,00</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-500/30">
          <h3 className="text-sm text-gray-400 mb-2">Tickets Usados</h3>
          <p className="text-4xl font-bold text-purple-400">342</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-blue-500/30">
        <h3 className="text-xl font-bold mb-4">Resumo Geral</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Usuários Ativos</p>
            <p className="text-2xl font-bold text-blue-400">1,234</p>
          </div>
          <div>
            <p className="text-gray-400">Personagens Criados</p>
            <p className="text-2xl font-bold text-pink-400">10</p>
          </div>
          <div>
            <p className="text-gray-400">Capítulos Publicados</p>
            <p className="text-2xl font-bold text-purple-400">58</p>
          </div>
          <div>
            <p className="text-gray-400">Figurinhas Gacha</p>
            <p className="text-2xl font-bold text-yellow-400">40</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// B) Gerenciar Personagens (CRUD)
function CharactersScreen({ showNotification, confirmDelete }: { showNotification: (msg: string) => void; confirmDelete: (name: string, onConfirm: () => void) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<any>(null);

  const handleSaveDraft = () => {
    showNotification('Personagem salvo como rascunho!');
    setShowForm(false);
  };

  const handlePublish = () => {
    showNotification('Personagem publicado com sucesso!');
    setShowForm(false);
  };

  const handleDelete = (name: string) => {
    confirmDelete(name, () => {
      showNotification(`Personagem "${name}" excluído!`);
    });
  };

  const handleDuplicate = (name: string) => {
    showNotification(`Personagem "${name}" duplicado como rascunho!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gerenciar Personagens</h2>
        <button
          onClick={() => {
            setEditingCharacter(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Criar Novo
        </button>
      </div>

      {showForm ? (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-blue-500/30">
          <h3 className="text-xl font-bold mb-6">
            {editingCharacter ? 'Editar Personagem' : 'Criar Personagem'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Sakura"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtítulo</label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: gótica sofisticada"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estilo</label>
                <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option>Anime</option>
                  <option>Realista</option>
                  <option>3D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sensualidade</label>
                <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option>Médio</option>
                  <option>Alto</option>
                  <option>Muito Alto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preço (moedas)</label>
                <input
                  type="number"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 80"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição Curta (fanfic)</label>
              <textarea
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-20"
                placeholder="Descrição breve do personagem..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Número de Capítulos</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Ex: 5"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Capa (upload)</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Clique ou arraste para fazer upload</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleSaveDraft}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Rascunho
              </button>
              <button 
                onClick={handlePublish}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Publicar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-full font-bold transition-all border border-gray-700 hover:bg-gray-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-gray-700/30 flex items-center gap-4">
              <div className="w-20 h-28 bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Personagem {i}</h3>
                <p className="text-sm text-gray-400">Anime • 5 capítulos • 80 moedas</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                    <Unlock className="w-3 h-3" />
                    Publicado
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => showNotification('Abrindo preview...')}
                  className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
                  title="Preview"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDuplicate(`Personagem ${i}`)}
                  className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
                  title="Duplicar"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    setEditingCharacter({ id: i, name: `Personagem ${i}` });
                    setShowForm(true);
                  }}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(`Personagem ${i}`)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// C) Gerenciar Capítulos & Extras
function ChaptersScreen({ showNotification, confirmDelete }: { showNotification: (msg: string) => void; confirmDelete: (name: string, onConfirm: () => void) => void }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Capítulos & Extras</h2>
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-500/30">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Selecionar Personagem</label>
          <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500">
            <option>Personagem 1</option>
            <option>Personagem 2</option>
            <option>Personagem 3</option>
          </select>
        </div>

        {!showForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Capítulos</h3>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Novo Capítulo
              </button>
            </div>

            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-black/30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold">Capítulo {i}: Título do Capítulo</h4>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Normal</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => confirmDelete(`Capítulo ${i}`, () => showNotification('Capítulo excluído!'))}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">Descrição curta do capítulo...</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Imagens:</p>
                    <p className="font-bold">3 imagens</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Thresholds:</p>
                    <p className="font-bold">20%, 50%, 100%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Recompensa:</p>
                    <p className="font-bold text-yellow-400">+15 moedas</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Criar/Editar Capítulo</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Título do Capítulo</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="Ex: Primeiro Encontro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Texto do Capítulo</label>
              <textarea
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 h-32"
                placeholder="Conteúdo do capítulo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500">
                <option>Normal</option>
                <option>Final</option>
                <option>Extra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Miniatura</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Upload da miniatura</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagens a Desbloquear</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Imagem {i}</p>
                    <input
                      type="number"
                      placeholder="Threshold %"
                      className="w-full mt-2 bg-black/50 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-bold mb-3">Recompensa ao Completar</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Moedas</label>
                  <input
                    type="number"
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                    placeholder="Ex: 15"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Conceder ticket de gacha</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  showNotification('Capítulo salvo!');
                  setShowForm(false);
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-full font-bold transition-all"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-full font-bold transition-all border border-gray-700 hover:bg-gray-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// D) Chat / Leitura (Editor de Diálogo)
function DialogueScreen({ showNotification }: { showNotification: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Chat / Leitura</h2>
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-pink-500/30">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Personagem</label>
            <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500">
              <option>Personagem 1</option>
              <option>Personagem 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Capítulo</label>
            <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500">
              <option>Capítulo 1</option>
              <option>Capítulo 2</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold">Mensagem #1 (Personagem)</h4>
              <button className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500 h-20 mb-3"
              placeholder="Texto da mensagem da personagem..."
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">Opções de Resposta (2-4)</label>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                    placeholder={`Opção ${i}: Responder de forma...`}
                  />
                  <select className="bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500">
                    <option>→ Mensagem #2</option>
                    <option>→ Mensagem #3</option>
                  </select>
                </div>
              ))}
              <button className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Adicionar Opção
              </button>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Nova Mensagem
          </button>
        </div>

        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-700">
          <button 
            onClick={() => showNotification('Abrindo preview...')}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Testar como Usuário
          </button>
          <button 
            onClick={() => showNotification('Fluxo salvo!')}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Fluxo
          </button>
        </div>
      </div>
    </div>
  );
}

// E) Gacha
function GachaScreen({ showNotification, confirmDelete }: { showNotification: (msg: string) => void; confirmDelete: (name: string, onConfirm: () => void) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Gacha</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-500/30">
          <h3 className="text-xl font-bold mb-4">Configurações Gerais</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Preço 1x (moedas)</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                defaultValue="150"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preço 10x (moedas)</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                defaultValue="1350"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor de Duplicata (moedas)</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                defaultValue="75"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-500/30">
          <h3 className="text-xl font-bold mb-4">Probabilidades</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                Comum (%)
              </label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                defaultValue="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                Raro (%)
              </label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                defaultValue="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                Épico (%)
              </label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                defaultValue="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                Lendário (%)
              </label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                defaultValue="5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-pink-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Banco de Figurinhas</h3>
          <button 
            onClick={() => showNotification('Criando nova figurinha...')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Figurinha
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-black/30 rounded-lg p-3 border border-gray-700">
              <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-2"></div>
              <p className="text-xs font-bold truncate">Figurinha {i}</p>
              <p className="text-xs text-purple-400">Épico</p>
              <div className="flex gap-1 mt-2">
                <button className="flex-1 p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-all">
                  <Edit className="w-3 h-3 mx-auto" />
                </button>
                <button 
                  onClick={() => confirmDelete(`Figurinha ${i}`, () => showNotification('Figurinha excluída!'))}
                  className="flex-1 p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-blue-500/30">
        <h3 className="text-xl font-bold mb-4">Métricas</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Gachas Rodados</p>
            <p className="text-3xl font-bold text-purple-400">1,234</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Tickets Usados</p>
            <p className="text-3xl font-bold text-yellow-400">342</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Duplicatas Convertidas</p>
            <p className="text-3xl font-bold text-green-400">567</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => showNotification('Configurações salvas!')}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-full font-bold transition-all"
      >
        Salvar Configurações
      </button>
    </div>
  );
}

// F) Colecionáveis
function CollectiblesScreen() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Colecionáveis</h2>
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-500/30">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Selecionar Personagem</label>
          <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500">
            <option>Personagem 1</option>
            <option>Personagem 2</option>
            <option>Personagem 3</option>
          </select>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              História (5 imagens)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="aspect-[3/4] bg-gray-700 rounded-lg border-2 border-green-500/50"></div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Extras (1 imagem)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              <div className="aspect-[3/4] bg-gray-700 rounded-lg border-2 border-yellow-500/50"></div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Image className="w-5 h-5 text-purple-400" />
              Gacha (4 figurinhas)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] bg-gray-700 rounded-lg border-2 border-purple-500/50"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-black/30 p-4 rounded-lg">
          <h4 className="font-bold mb-3">Recompensa por Completar Coleção</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Moedas</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                placeholder="Ex: 50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tickets</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                placeholder="Ex: 1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// G) Check-in
function CheckinScreen({ showNotification }: { showNotification: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Check-in</h2>
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-green-500/30">
        <h3 className="text-xl font-bold mb-4">Configurações de Check-in</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recompensa Diária (moedas)</label>
            <input
              type="number"
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
              defaultValue="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prêmio do Dia 7</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                defaultValue="1"
              />
              <span className="text-sm text-gray-400">ticket(s) de gacha</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h4 className="font-bold mb-3">Conceder Tickets Manualmente</h4>
            <div className="flex gap-2">
              <select className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500">
                <option>Selecionar usuário...</option>
                <option>usuario1@email.com</option>
                <option>usuario2@email.com</option>
              </select>
              <input
                type="number"
                className="w-24 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                placeholder="Qtd"
                min="1"
              />
              <button 
                onClick={() => showNotification('Tickets concedidos!')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2 rounded-full font-bold transition-all"
              >
                Conceder
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => showNotification('Configurações salvas!')}
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-full font-bold transition-all"
        >
          Salvar Configurações
        </button>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-blue-500/30">
        <h3 className="text-xl font-bold mb-4">Contadores Gerais</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Check-ins Hoje</p>
            <p className="text-3xl font-bold text-green-400">234</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Streaks Ativos</p>
            <p className="text-3xl font-bold text-blue-400">156</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Tickets Concedidos</p>
            <p className="text-3xl font-bold text-purple-400">89</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// H) Loja de Moedas
function ShopScreen({ showNotification, confirmDelete }: { showNotification: (msg: string) => void; confirmDelete: (name: string, onConfirm: () => void) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Loja de Moedas</h2>
        <button 
          onClick={() => showNotification('Criando novo pacote...')}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Pacote
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-500/30">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantidade de Moedas</label>
                <input
                  type="number"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                  defaultValue={i * 100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                  defaultValue={`R$ ${(i * 4.9).toFixed(2)}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link de Checkout (Keoto)</label>
                <input
                  type="url"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Produto</label>
                <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500">
                  <option>Compra Única</option>
                  <option>Assinatura Mensal</option>
                  <option>Assinatura Anual</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all">
                  <Edit className="w-4 h-4 mx-auto" />
                </button>
                <button 
                  onClick={() => confirmDelete(`Pacote ${i * 100} moedas`, () => showNotification('Pacote excluído!'))}
                  className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-blue-500/30">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-5 h-5" />
          <div>
            <p className="font-bold">Modo Admin (Teste)</p>
            <p className="text-xs text-gray-400">Compras via Admin recarregam saldo sem gateway (apenas para testes)</p>
          </div>
        </label>
      </div>
    </div>
  );
}

// I) Transações / Logs & Ferramentas Admin
function UsersScreen({ showNotification }: { showNotification: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Transações / Logs</h2>
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-blue-500/30">
        <div className="flex gap-4 mb-6">
          <select className="bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
            <option>Todas as Transações</option>
            <option>Moedas Ganhas</option>
            <option>Moedas Gastas</option>
            <option>Desbloqueios</option>
            <option>Tickets Usados</option>
          </select>
          
          <input
            type="text"
            placeholder="Buscar por email..."
            className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          
          <input
            type="date"
            className="bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          
          <button 
            onClick={() => showNotification('Exportando CSV...')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-black/30 rounded-lg p-3 border border-gray-700 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-500">2024-01-{i.toString().padStart(2, '0')} 14:30</span>
                <span className="font-mono text-gray-400">usuario{i}@email.com</span>
                <span className={`px-2 py-1 rounded-full text-xs ${ 
                  i % 3 === 0 ? 'bg-green-500/20 text-green-400' :
                  i % 3 === 1 ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {i % 3 === 0 ? 'Ganhou' : i % 3 === 1 ? 'Gastou' : 'Desbloqueou'}
                </span>
              </div>
              <span className="font-bold">
                {i % 3 === 0 ? '+10 moedas' : i % 3 === 1 ? '-150 moedas' : 'Personagem 1'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-500/30">
        <h3 className="text-xl font-bold mb-4">Ferramentas Administrativas</h3>
        
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg">
            <h4 className="font-bold mb-3">Conceder Moedas</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email do usuário"
                className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                placeholder="Moedas"
                className="w-32 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={() => showNotification('Moedas concedidas!')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-2 rounded-full font-bold transition-all"
              >
                Conceder
              </button>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <h4 className="font-bold mb-3">Publicar/Despublicar em Massa</h4>
            <div className="flex gap-2">
              <select className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500">
                <option>Selecionar personagens...</option>
                <option>Personagem 1</option>
                <option>Personagem 2</option>
                <option>Personagem 3</option>
              </select>
              <button 
                onClick={() => showNotification('Publicando...')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2 rounded-full font-bold transition-all"
              >
                Publicar
              </button>
              <button 
                onClick={() => showNotification('Despublicando...')}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-2 rounded-full font-bold transition-all"
              >
                Despublicar
              </button>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg border-2 border-red-500/30">
            <h4 className="font-bold mb-2 text-red-400">Reset Sandbox</h4>
            <p className="text-xs text-gray-400 mb-3">Reseta apenas a visualização admin/teste (não afeta usuários reais)</p>
            <button 
              onClick={() => showNotification('Sandbox resetado!')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-2 rounded-full font-bold transition-all"
            >
              Resetar Sandbox
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// J) Preview como Usuário
function ExtrasScreen() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Preview como Usuário</h2>
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border-2 border-purple-500/30 text-center">
        <Eye className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">Modo Preview</h3>
        <p className="text-gray-400 mb-6">
          Visualize o app exatamente como um usuário veria, sem sair do painel admin.
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium mb-2">Selecionar Personagem</label>
            <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500">
              <option>Personagem 1</option>
              <option>Personagem 2</option>
              <option>Personagem 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Selecionar Capítulo</label>
            <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500">
              <option>Capítulo 1</option>
              <option>Capítulo 2</option>
              <option>Capítulo 3</option>
            </select>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2">
            <Eye className="w-5 h-5" />
            Abrir Preview
          </button>
        </div>
      </div>
    </div>
  );
}
