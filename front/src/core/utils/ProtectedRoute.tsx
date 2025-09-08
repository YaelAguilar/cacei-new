import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthViewModel } from '../../features/auth/presentation/viewModels/AuthViewModel';
import { FiAlertTriangle } from 'react-icons/fi';
import { MdHome } from "react-icons/md";

interface ProtectedRouteProps {
  children: ReactNode;
  authViewModel: AuthViewModel;
  fallback?: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({
  children,
  authViewModel,
  fallback,
  redirectTo = '/login'
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultFallback = (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso denegado
          </h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          >
            ← Volver
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <MdHome className="w-5 h-5" />
            Inicio
          </button>
        </div>
      </div>
    </div>
  );

  // Mostrar loading mientras se inicializa
  if (!authViewModel.isInitialized || authViewModel.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!authViewModel.isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Verificar si tiene acceso a la ruta actual
  if (!authViewModel.hasAccessToPath(location.pathname)) {
    return <>{fallback ?? defaultFallback}</>;
  }

  return <>{children}</>;
});

export default ProtectedRoute;