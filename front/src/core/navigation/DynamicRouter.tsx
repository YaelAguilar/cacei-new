import React, { useMemo } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../utils/AuthContext';
import ProtectedRoute from '../utils/ProtectedRoute';
import { LazyComponentWrapper } from './LazyComponentWrapper';
import { NavigationHelper } from '../utils/NavigationHelper';
import LoginPage from "../../features/auth/presentation/pages/Login";
import Dashboard from '../../features/dashboard/presentation/pages/Dashboard';
import NotFoundComponent from '../utils/NotFountPage';

const DynamicRouter: React.FC = observer(() => {
  const authViewModel = useAuth();

  const router = useMemo(() => {
    const routes = [
      // ======================================================================
      // RUTAS PÚBLICAS
      // ======================================================================
      {
        path: "/login",
        element: authViewModel.isAuthenticated ?
          <Navigate to="/" replace /> :
          <LoginPage />
      }
    ];

    if (authViewModel.isAuthenticated && authViewModel.userPermissions) {
      // ======================================================================
      // RUTAS PROTEGIDAS
      // ======================================================================

      // Ruta raíz redirige a home
      routes.push({
        path: "/",
        element: <Dashboard />
      });

      // ======================================================================
      // RUTAS DINÁMICAS (generadas desde permisos)
      // ======================================================================
      const dynamicRoutes = NavigationHelper.generateDynamicRoutes(
        authViewModel.userPermissions.menus
      );

      //console.group('🚀 Generando rutas dinámicas desde permisos');
      //console.log(`📊 Total de rutas generadas: ${dynamicRoutes.length}`);

      dynamicRoutes.forEach(routeConfig => {
        routes.push({
          path: routeConfig.path,
          element: (
            <ProtectedRoute authViewModel={authViewModel}>
              <LazyComponentWrapper
                componentName={routeConfig.componentName}
                featureName={routeConfig.featureName}
              />
            </ProtectedRoute>
          )
        });
      });

      // ======================================================================
      // REDIRECCIONES AUTOMÁTICAS
      // ======================================================================
      const autoRedirects = NavigationHelper.getAutoRedirects(
        authViewModel.userPermissions.menus
      );

      autoRedirects.forEach(redirect => {
        //console.log(`🔄 Auto-redirect: ${redirect.from} → ${redirect.to}`);
        routes.push({
          path: redirect.from,
          element: <Navigate to={redirect.to} replace />
        });
      });

      // ======================================================================
      // RUTAS ESPECIALES (casos que requieren manejo manual)
      // ======================================================================

      // Página de inicio/home (hardcodeada)
      routes.push({
        path: "/",
        element: (
          <ProtectedRoute authViewModel={authViewModel}>
            <LazyComponentWrapper
              componentName="Dashboard"
              featureName="dashboard"
            />
          </ProtectedRoute>
        )
      });

      // Roles con parámetros dinámicos
      routes.push({
        path: "/roles/:roleId/permisos",
        element: (
          <ProtectedRoute authViewModel={authViewModel}>
            <LazyComponentWrapper
              componentName="RolePermissions"
              featureName="roles"
            />
          </ProtectedRoute>
        )
      });

      // ======================================================================
      // RUTA 404
      // ======================================================================
      routes.push({
        path: "*",
        element: (
          <ProtectedRoute authViewModel={authViewModel}>
            <NotFoundComponent />
          </ProtectedRoute>
        )
      });

      console.groupEnd();
    } else {
      // Usuario no autenticado
      routes.push({
        path: "*",
        element: <Navigate to="/login" replace />
      });
    }

    return createBrowserRouter(routes);
  }, [
    authViewModel.isAuthenticated,
    authViewModel.userPermissions
  ]);

  return <RouterProvider router={router} />;
});

export default DynamicRouter;