import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { AuthViewModel } from '../../features/auth/presentation/viewModels/AuthViewModel';

// Singleton del AuthViewModel
let authViewModelInstance: AuthViewModel | null = null;

const getAuthViewModel = (): AuthViewModel => {
  if (!authViewModelInstance) {
    authViewModelInstance = new AuthViewModel();
  }
  return authViewModelInstance;
};

const AuthContext = createContext<AuthViewModel | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authViewModel = getAuthViewModel();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    // Si hay datos en localStorage pero no está inicializado, verificar sesión
    const authData = localStorage.getItem('auth-storage');
    if (authData && !authViewModel.isAuthenticated) {
      // Aquí podrías llamar a un método checkAuth() si lo implementas
      // Por ahora, el ViewModel ya inicializa desde localStorage
    }
  }, [authViewModel]);

  return (
    <AuthContext.Provider value={authViewModel}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthViewModel => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};