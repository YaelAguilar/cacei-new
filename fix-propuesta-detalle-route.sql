-- Script para corregir la ruta del submenú "Detalle de Propuesta"
-- Problema: La ruta estaba configurada como /propuesta/:id/detalle pero se construía como /mis-propuestas/propuesta/:id/detalle
-- Solución: Cambiar la ruta a /propuesta/:id/detalle para que coincida con la ruta real

-- 1. Actualizar la ruta del submenú "Detalle de Propuesta"
-- El problema es que la ruta se concatena con el menú padre (/mis-propuestas)
-- Necesitamos que sea una ruta absoluta, no relativa
UPDATE `submenus` 
SET `path` = '/propuesta/:id/detalle'
WHERE `uuid` = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- 2. Verificar que el submenú existe y tiene los permisos correctos
SELECT 
    s.id,
    s.uuid,
    s.name,
    s.path,
    s.component_name,
    s.active
FROM `submenus` s
WHERE s.uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- 3. Verificar los permisos de roles para este submenú
SELECT 
    rs.id,
    r.name as role_name,
    s.name as submenu_name,
    s.path as submenu_path
FROM `role_submenu` rs
JOIN `roles` r ON rs.id_role = r.id
JOIN `submenus` s ON rs.id_submenu = s.id
WHERE s.uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- 4. Verificar la relación con el menú padre
SELECT 
    ms.id,
    m.name as menu_name,
    m.path as menu_path,
    s.name as submenu_name,
    s.path as submenu_path,
    CONCAT(m.path, s.path) as full_path
FROM `menu_submenu` ms
JOIN `menus` m ON ms.id_menu = m.id
JOIN `submenus` s ON ms.id_submenu = s.id
WHERE s.uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
