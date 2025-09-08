// src/features/auth/presentation/pages/Login.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useAuth } from "../../../../core/utils/AuthContext"; // ← Usar el contexto
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = observer(() => {
  const authViewModel = useAuth(); // ← Usar la instancia singleton
  const navigate = useNavigate();

  useEffect(() => {
    if (authViewModel.isAuthenticated && authViewModel.isInitialized) {
      navigate('/');
    }
  }, [authViewModel.isAuthenticated, authViewModel.isInitialized, navigate]);

  const handleLoginSuccess = () => {
    navigate('/');
  };

  // Mostrar loading mientras se inicializa
  if (!authViewModel.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Inicializando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <LoginForm 
            viewModel={authViewModel} 
            onSuccess={handleLoginSuccess}
          />
        </div>
      </div>
    </div>
  );
});

export default LoginPage;