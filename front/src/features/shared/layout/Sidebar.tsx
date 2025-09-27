import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../../core/utils/AuthContext';
import { NavigationHelper, NavigationItem } from '../../../core/utils/NavigationHelper';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../../core/assets/logo.svg"
import { CiLogout } from "react-icons/ci";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { DynamicIcon } from '../components/IconMapper';

const Sidebar: React.FC = observer(() => {
  const authViewModel = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Si no está autenticado, no mostrar sidebar
  if (!authViewModel.isAuthenticated || !authViewModel.userPermissions) {
    return null;
  }

  const navigationItems = NavigationHelper.buildNavigationTree(
    authViewModel.userPermissions.menus
  );

  const handleItemClick = (item: NavigationItem, parentPath?: string) => {
    const hasChildren = item.children && item.children.length > 0;
    
    if (hasChildren) {
      // Toggle expandido/colapsado
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else {
      // Construir la ruta completa para submenús
      const fullPath = parentPath ? `${parentPath}${item.path}` : item.path;
      navigate(fullPath);
    }
  };

  const isActiveRoute = (path: string, parentPath?: string): boolean => {
    const fullPath = parentPath ? `${parentPath}${path}` : path;
    return location.pathname.startsWith(fullPath);
  };

  const isItemExpanded = (itemId: string): boolean => {
    return expandedItems.has(itemId);
  };

  // Función para verificar si un item padre tiene un hijo activo
  const hasActiveChild = (item: NavigationItem, parentPath?: string): boolean => {
    if (!item.children) return false;
    
    return item.children.some(child => 
      isActiveRoute(child.path, parentPath || item.path) || hasActiveChild(child, parentPath || item.path)
    );
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0, parentPath?: string) => {
    const hasChildren = item.children && item.children.length > 0;
    const currentPath = parentPath || item.path;
    const isActive = isActiveRoute(item.path, parentPath);
    const isExpanded = isItemExpanded(item.id);
    const hasActiveChildItem = hasActiveChild(item, parentPath);
    const paddingLeft = level * 12 + 16; // Indentación por nivel

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => handleItemClick(item, parentPath)}
          className={`
            w-full flex items-center justify-between py-3 px-4 text-left text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
            ${isActive 
              ? 'bg-blue-600 text-white shadow-md' 
              : hasActiveChildItem
                ? 'bg-blue-700/30 text-blue-300 border-l-2 border-blue-500'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }
          `}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <div className="flex items-center min-w-0">
            <DynamicIcon iconName={item.icon}/>
            <span className="ml-3 truncate">{item.name}</span>
          </div>
          
          {/* Mostrar chevron solo si tiene hijos */}
          {hasChildren && (
            <div className="ml-2 flex-shrink-0">
              {isExpanded ? (
                <FaChevronDown className="w-4 h-4" />
              ) : (
                <FaChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </button>

        {/* Renderizar hijos si existen y está expandido */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 overflow-hidden">
            <div className="animate-fade-in">
              {item.children!
                .filter(child => child.name !== 'Detalle de Propuesta') // Ocultar este submenú del sidebar
                .map(child => renderNavigationItem(child, level + 1, currentPath))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='hidden md:block p-0 md:p-3 h-screen min-h-screen max-w-[25rem] w-[18rem] z-10 md:relative fixed'>
      <div className='bg-[#131212] h-full rounded-lg text-gray shadow-xl overflow-hidden flex flex-col'>
        
        {/* Header del sidebar */}
        <div className="p-4 border-b border-gray-700 flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-16 h-16 mb-2 object-contain" />
          <h2 className="text-lg font-semibold text-white mb-2 text-center">Analítica CACEI</h2>
          
          {/* Información del usuario */}
          <div className="bg-gray-800 rounded-lg p-3 w-full text-center">
            <p className="text-sm font-medium text-white truncate">
              {authViewModel.currentUser?.getName()} {authViewModel.currentUser?.getLastName()}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {authViewModel.userRoles.map(role => role.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navigationItems.length > 0 ? (
              navigationItems.map(item => renderNavigationItem(item))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm">No hay menús disponibles</p>
              </div>
            )}
          </nav>
        </div>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => authViewModel.logout(navigate)}
            className="w-full flex items-center justify-center py-2 px-4 gap-2 text-sm font-medium text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
            disabled={authViewModel.loading}
          >
            <CiLogout size={20} />
            {authViewModel.loading ? 'Cerrando...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default Sidebar;