import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../../data/models/User";
import { AuthRepository } from "../../data/repository/authRepository";
import { LoginUseCase } from "../../domain/LoginUseCase";
import { UserPermissions, Menu, Submenu } from "../../data/models/MenuPermission";
import { NavigateFunction } from "react-router-dom";

export class AuthViewModel {
  // Propiedades de autenticación
  currentUser: User | null = null;
  userUuid: string | null = null;
  userRoles: { id: number, name: string }[] = [];
  userPermissions: UserPermissions | null = null;
  isAuthenticated: boolean = false;

  // Propiedades para el manejo de UI
  loading: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;

  // Casos de uso
  private repository: AuthRepository;
  private loginUseCase: LoginUseCase;

  constructor() {
    makeAutoObservable(this);

    this.repository = new AuthRepository();
    this.loginUseCase = new LoginUseCase(this.repository);

    this.initializeFromStorage();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async setUser(user: User, permissions: UserPermissions, token?: string) {
    this.currentUser = user;
    this.userUuid = user.getUuid() || null;
    this.userRoles = user.getRoles() || [];
    this.userPermissions = permissions;
    this.isAuthenticated = true;
    
    // Almacenar el token JWT si se proporciona
    if (token) {
      localStorage.setItem('auth-token', token);
      
      // Obtener información completa del usuario desde el backend
      try {
        const userData = await this.repository.getCurrentUser();
        if (userData) {
          // Actualizar el usuario con el ID real
          this.currentUser = new User(
            userData.id,
            userData.name,
            userData.lastName,
            userData.secondLastName || '',
            userData.email,
            '', // password
            '', // confirmPassword
            userData.uuid,
            userData.roles || [],
            true, // active
            undefined, // created_at
            undefined, // updated_at
            undefined, // user_creation
            undefined  // user_update
          );
          console.log('✅ Usuario actualizado con ID real:', userData.id);
        }
      } catch (error) {
        console.error('❌ Error al obtener información del usuario:', error);
      }
    }
    
    this.saveToStorage();
  }

  clearUser() {
    this.currentUser = null;
    this.userUuid = null;
    this.userRoles = [];
    this.userPermissions = null;
    this.isAuthenticated = false;
    this.clearStorage();
  }

  private saveToStorage() {
    const authData = {
      currentUser: this.currentUser ? {
        id: this.currentUser.getId(),
        uuid: this.currentUser.getUuid(),
        name: this.currentUser.getName(),
        lastName: this.currentUser.getLastName(),
        secondLastName: this.currentUser.getSecondLastName(),
        email: this.currentUser.getEmail(),
        roles: this.currentUser.getRoles()
      } : null,
      userUuid: this.userUuid,
      userRoles: this.userRoles,
      userPermissions: this.userPermissions,
      isAuthenticated: this.isAuthenticated
    };
    localStorage.setItem('auth-storage', JSON.stringify(authData));
    console.log('💾 Auth data saved to localStorage:', authData);
  }



  private initializeFromStorage() {
    try {
      const authData = localStorage.getItem('auth-storage');
      console.log('🔍 Initializing from storage:', authData);

      if (authData) {
        const parsed = JSON.parse(authData);
        console.log('📦 Parsed auth data:', parsed);

        // Restaurar usuario completo
        if (parsed.currentUser) {
          console.log('👤 Creating user from storage:', {
            id: parsed.currentUser.id,
            name: parsed.currentUser.name,
            uuid: parsed.currentUser.uuid
          });
          
          this.currentUser = new User(
            parsed.currentUser.id || '', // id
            parsed.currentUser.name,
            parsed.currentUser.lastName,
            parsed.currentUser.secondLastName || '',
            parsed.currentUser.email,
            '', // password
            '', // confirmPassword
            parsed.currentUser.uuid,
            parsed.currentUser.roles || [],
            true, // active
            undefined, // created_at
            undefined, // updated_at
            undefined, // user_creation
            undefined  // user_update
          );
          
          console.log('✅ User created with ID:', this.currentUser.getId());
        }

        this.userUuid = parsed.userUuid;
        this.userRoles = parsed.userRoles || [];
        this.userPermissions = parsed.userPermissions || null;
        this.isAuthenticated = parsed.isAuthenticated || false;

        // ✅ NUEVO: Si el usuario está autenticado pero no tiene ID, obtenerlo del backend
        if (this.isAuthenticated && this.currentUser && (!this.currentUser.getId() || this.currentUser.getId() === '')) {
          console.log('🔄 Usuario autenticado sin ID, obteniendo desde backend...');
          this.loadUserFromBackend();
        }

        /* console.log('✅ Auth state restored:', {
          isAuthenticated: this.isAuthenticated,
          currentUser: this.currentUser?.getName(),
          userRoles: this.userRoles,
          hasPermissions: !!this.userPermissions
        }); */
      }
    } catch (error) {
      console.error('❌ Error loading auth data from storage:', error);
      this.clearStorage(); // Limpiar datos corruptos
    }

    this.isInitialized = true;
    //console.log('🏁 AuthViewModel initialized, isAuthenticated:', this.isAuthenticated);
  }

  private clearStorage() {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('auth-token');
  }

  // ✅ NUEVO: Cargar información del usuario desde el backend
  private async loadUserFromBackend() {
    try {
      console.log('🔍 Obteniendo información del usuario desde backend...');
      const userData = await this.repository.getCurrentUser();
      
      if (userData && this.currentUser) {
        console.log('📦 Datos del usuario obtenidos:', userData);
        
        // Actualizar el usuario con el ID real
        this.currentUser = new User(
          userData.id,
          userData.name,
          userData.lastName,
          userData.secondLastName || '',
          userData.email,
          '', // password
          '', // confirmPassword
          userData.uuid,
          userData.roles || [],
          true, // active
          undefined, // created_at
          undefined, // updated_at
          undefined, // user_creation
          undefined  // user_update
        );
        
        console.log('✅ Usuario actualizado con ID real:', userData.id);
        
        // Guardar los datos actualizados en localStorage
        this.saveToStorage();
      }
    } catch (error) {
      console.error('❌ Error al obtener información del usuario desde backend:', error);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      const result = await this.loginUseCase.execute(email, password);

      runInAction(async () => {
        if (result) {
          await this.setUser(result.user, result.permissions, result.token);
          return true;
        } else {
          this.setError("Credenciales inválidas");
          return false;
        }
      });

      return !!result;
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Error en el login");
      });
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  // Opción 1: Pasar navigate como parámetro
  async logout(navigate?: NavigateFunction): Promise<void> {
    this.setLoading(true);

    try {
      await this.repository.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      runInAction(() => {
        this.clearUser();
        this.setLoading(false);

        // Navegar al login si se proporcionó la función navigate
        if (navigate) {
          navigate('/login');
        }
      });
    }
  }

  // Métodos para validación de rutas dinámicas
  hasAccessToPath(path: string): boolean {
    if (!this.userPermissions) {
      console.log(`❌ No hay permisos de usuario para verificar: ${path}`);
      return false;
    }

    console.log(`🔍 Verificando acceso a: ${path}`);
    console.log(`📋 Permisos disponibles:`, this.userPermissions.menus.map(m => ({
      name: m.attributes.name,
      path: m.attributes.path,
      assigned: m.attributes.assigned,
      submenus: m.relationships.submenus.data.map(s => ({
        name: s.attributes.name,
        path: s.attributes.path,
        assigned: s.attributes.assigned
      }))
    })));

    const hasAccess = this.userPermissions.menus.some(menu => {
      // 1. Verificar acceso al menú principal (exacto)
      if (menu.attributes.assigned && menu.attributes.path === path) {
        console.log(`✅ Acceso concedido por menú principal: ${menu.attributes.path}`);
        return true;
      }

      // 2. ✅ NUEVO: Verificar acceso a rutas que empiecen con el path del menú
      // Esto maneja casos como "/roles/:id/permisos" donde necesitas acceso a "/roles"
      if (menu.attributes.assigned && path.startsWith(menu.attributes.path + '/')) {
        console.log(`✅ Acceso concedido por prefijo de menú: ${menu.attributes.path}`);
        return true;
      }

      // 3. Verificar acceso a submenús (con rutas completas)
      const submenuAccess = menu.relationships.submenus.data.some(submenu => {
        if (!submenu.attributes.assigned) {
          console.log(`⏭️ Submenú no asignado: ${submenu.attributes.name}`);
          return false;
        }

        // Construir ruta completa del submenú
        // Si el submenú tiene una ruta que empieza con '/', es una ruta absoluta
        const fullSubmenuPath = submenu.attributes.path.startsWith('/') 
          ? submenu.attributes.path 
          : `${menu.attributes.path}${submenu.attributes.path}`;
        console.log(`🔍 Verificando submenú: ${fullSubmenuPath} vs ${path}`);

        // Verificar coincidencia exacta
        if (fullSubmenuPath === path) {
          console.log(`✅ Acceso concedido por coincidencia exacta: ${fullSubmenuPath}`);
          return true;
        }

        // ✅ NUEVO: También verificar rutas que empiecen con el submenú
        if (path.startsWith(fullSubmenuPath + '/')) {
          console.log(`✅ Acceso concedido por prefijo de submenú: ${fullSubmenuPath}`);
          return true;
        }

        // ✅ NUEVO: Manejar rutas dinámicas con parámetros
        // Convertir ruta con parámetros a patrón regex
        const dynamicPattern = fullSubmenuPath.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${dynamicPattern}$`);
        console.log(`🔍 Patrón dinámico: ${dynamicPattern} -> regex: ${regex}`);
        if (regex.test(path)) {
          console.log(`✅ Acceso concedido por patrón dinámico: ${fullSubmenuPath} -> ${path}`);
          return true;
        }

        console.log(`❌ Submenú no coincide: ${fullSubmenuPath}`);
        return false;
      });

      return submenuAccess;
    });

    if (!hasAccess) {
      console.log(`❌ Acceso denegado a: ${path}`);
      console.log('📋 Rutas disponibles:', this.getAllAssignedPaths());
    }

    return hasAccess;
  }

  getAssignedMenus(): Menu[] {
    if (!this.userPermissions) return [];
    return this.userPermissions.menus.filter(menu => menu.attributes.assigned);
  }

  getAssignedSubmenus(): Submenu[] {
    if (!this.userPermissions) return [];

    const submenus: Submenu[] = [];
    this.userPermissions.menus.forEach(menu => {
      menu.relationships.submenus.data.forEach(submenu => {
        if (submenu.attributes.assigned) {
          submenus.push(submenu);
        }
      });
    });

    return submenus;
  }

  getAllAssignedPaths(): string[] {
    const paths: string[] = [];

    if (!this.userPermissions) return paths;

    this.userPermissions.menus.forEach(menu => {
      // Agregar rutas de menús asignados
      if (menu.attributes.assigned) {
        paths.push(menu.attributes.path);
      }

      // Agregar rutas completas de submenús asignados
      menu.relationships.submenus.data.forEach(submenu => {
        if (submenu.attributes.assigned) {
          const fullPath = `${menu.attributes.path}${submenu.attributes.path}`;
          paths.push(fullPath);
        }
      });
    });

    return [...new Set(paths)]; // Eliminar duplicados
  }
}