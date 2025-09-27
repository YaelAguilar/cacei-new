// Script para corregir los permisos del menú del rol Alumno
// Remover el permiso del submenú "Detalle de Propuesta" que no debería aparecer en el sidebar

const mysql = require('mysql2/promise');

async function fixMenuPermissions() {
    let connection;
    
    try {
        // Configuración de la base de datos
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Ajustar según tu configuración
            database: 'cacei'
        });

        console.log('🔍 Verificando permisos actuales del rol Alumno...');
        
        // 1. Verificar el permiso actual
        const [currentPermissions] = await connection.execute(`
            SELECT 
                rs.id,
                r.name as role_name,
                s.name as submenu_name,
                s.path as submenu_path,
                s.component_name
            FROM role_submenu rs
            JOIN roles r ON rs.id_role = r.id
            JOIN submenus s ON rs.id_submenu = s.id
            WHERE r.id = 15 AND s.id = 19
        `);

        if (currentPermissions.length > 0) {
            console.log('❌ Permiso encontrado que debe ser removido:');
            console.log(currentPermissions[0]);
            
            // 2. Remover el permiso
            const [result] = await connection.execute(`
                DELETE FROM role_submenu 
                WHERE id_role = 15 AND id_submenu = 19
            `);
            
            console.log(`✅ Permiso removido exitosamente. Filas afectadas: ${result.affectedRows}`);
        } else {
            console.log('✅ El permiso ya no existe o fue removido previamente.');
        }

        // 3. Verificar los permisos restantes del rol Alumno
        console.log('\n📋 Permisos restantes del rol Alumno:');
        const [remainingPermissions] = await connection.execute(`
            SELECT 
                rs.id,
                r.name as role_name,
                s.name as submenu_name,
                s.path as submenu_path,
                s.component_name
            FROM role_submenu rs
            JOIN roles r ON rs.id_role = r.id
            JOIN submenus s ON rs.id_submenu = s.id
            WHERE r.id = 15
            ORDER BY s.sort_order ASC
        `);

        remainingPermissions.forEach(perm => {
            console.log(`  - ${perm.submenu_name} (${perm.submenu_path})`);
        });

        // 4. Verificar que el submenú sigue existiendo
        console.log('\n🔍 Verificando que el submenú "Detalle de Propuesta" sigue existiendo...');
        const [submenuExists] = await connection.execute(`
            SELECT 
                s.id,
                s.name,
                s.path,
                s.component_name,
                s.active
            FROM submenus s
            WHERE s.id = 19
        `);

        if (submenuExists.length > 0) {
            console.log('✅ Submenú "Detalle de Propuesta" sigue existiendo:');
            console.log(submenuExists[0]);
        } else {
            console.log('❌ Error: El submenú "Detalle de Propuesta" no existe');
        }

        console.log('\n🎉 Corrección completada exitosamente!');
        console.log('El submenú "Detalle de Propuesta" ya no aparecerá en el menú del sidebar para alumnos.');
        console.log('Los alumnos podrán seguir accediendo a esta página desde los botones "Ver detalles" de las propuestas.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar el script
fixMenuPermissions();
