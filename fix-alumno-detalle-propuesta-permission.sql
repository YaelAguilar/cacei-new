-- Script para remover el permiso del submenú "Detalle de Propuesta" del rol "Alumno"
-- Problema: El submenú "Detalle de Propuesta" aparece en el menú del sidebar para alumnos
-- Solución: Remover este permiso ya que esta página se accede directamente desde los botones "Ver detalles"

-- 1. Verificar el permiso actual del rol Alumno (ID: 15) para el submenú "Detalle de Propuesta" (ID: 19)
SELECT 
    rs.id,
    r.name as role_name,
    s.name as submenu_name,
    s.path as submenu_path,
    s.component_name
FROM `role_submenu` rs
JOIN `roles` r ON rs.id_role = r.id
JOIN `submenus` s ON rs.id_submenu = s.id
WHERE r.id = 15 AND s.id = 19;

-- 2. Remover el permiso del submenú "Detalle de Propuesta" del rol "Alumno"
DELETE FROM `role_submenu` 
WHERE `id_role` = 15 AND `id_submenu` = 19;

-- 3. Verificar que el permiso fue removido
SELECT 
    rs.id,
    r.name as role_name,
    s.name as submenu_name,
    s.path as submenu_path
FROM `role_submenu` rs
JOIN `roles` r ON rs.id_role = r.id
JOIN `submenus` s ON rs.id_submenu = s.id
WHERE r.id = 15 AND s.id = 19;

-- 4. Verificar los permisos restantes del rol Alumno
SELECT 
    rs.id,
    r.name as role_name,
    s.name as submenu_name,
    s.path as submenu_path,
    s.component_name
FROM `role_submenu` rs
JOIN `roles` r ON rs.id_role = r.id
JOIN `submenus` s ON rs.id_submenu = s.id
WHERE r.id = 15
ORDER BY s.sort_order ASC;

-- 5. Verificar que el submenú "Detalle de Propuesta" sigue existiendo pero sin permisos para Alumno
SELECT 
    s.id,
    s.name,
    s.path,
    s.component_name,
    s.active
FROM `submenus` s
WHERE s.id = 19;
