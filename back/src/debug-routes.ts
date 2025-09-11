// debug-routes.ts - Archivo temporal para debug
import express from 'express';

// Función para validar rutas antes de registrarlas
export function validateRouter(router: express.Router, routerName: string): boolean {
  try {
    console.log(`🔍 Validando router: ${routerName}`);
    
    // Crear una app temporal para probar el router
    const testApp = express();
    testApp.use('/test', router);
    
    console.log(`✅ Router ${routerName} es válido`);
    return true;
  } catch (error) {
    console.error(`❌ Router ${routerName} tiene errores:`, error);
    return false;
  }
}

// Función para registrar rutas de forma segura
export function safeRegisterRouter(
  app: express.Application, 
  path: string, 
  router: express.Router, 
  routerName: string,
  middleware?: any[]
): boolean {
  try {
    console.log(`🔄 Registrando ${routerName} en ${path}`);
    
    if (middleware && middleware.length > 0) {
      app.use(path, ...middleware, router);
    } else {
      app.use(path, router);
    }
    
    console.log(`✅ ${routerName} registrado exitosamente`);
    return true;
  } catch (error) {
    console.error(`❌ Error registrando ${routerName}:`, error);
    return false;
  }
}