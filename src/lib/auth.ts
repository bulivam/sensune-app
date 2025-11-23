// Sistema de autenticação simples (localStorage)
import { User } from './types';

const USERS_KEY = 'sensune_users';
const CURRENT_USER_KEY = 'sensune_current_user';

// Usuário admin padrão
const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  email: 'admin@sensune.com',
  isAdmin: true,
  createdAt: new Date('2024-01-01')
};

export function initializeAuth() {
  if (typeof window === 'undefined') return;
  
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    // Criar admin padrão
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
  }
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Ambiente inválido' };
  
  // Admin login (senha: admin123)
  if (email === 'admin@sensune.com' && password === 'admin123') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEFAULT_ADMIN));
    return { success: true, user: DEFAULT_ADMIN };
  }
  
  const usersData = localStorage.getItem(USERS_KEY);
  if (!usersData) return { success: false, error: 'Usuário não encontrado' };
  
  const users: User[] = JSON.parse(usersData);
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, error: 'Usuário não encontrado' };
  }
  
  // Simulação simples (em produção usaria hash de senha)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function register(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Ambiente inválido' };
  
  const usersData = localStorage.getItem(USERS_KEY);
  const users: User[] = usersData ? JSON.parse(usersData) : [];
  
  // Verificar se email já existe
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email já cadastrado' };
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    isAdmin: false,
    createdAt: new Date()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  return { success: true, user: newUser };
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(CURRENT_USER_KEY);
  if (!userData) return null;
  
  return JSON.parse(userData);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.isAdmin || false;
}
