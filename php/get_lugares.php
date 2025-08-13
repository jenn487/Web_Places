<?php
require_once 'config.php';

try {
    $pdo = getConnection();
    
    // Verificar parámetros
    $provincia_id = $_GET['provincia_id'] ?? null;
    $categoria = $_GET['categoria'] ?? null;
    
    if (!$provincia_id) {
        sendResponse([
            'success' => false,
            'error' => 'ID de provincia requerido'
        ], 400);
    }
    
    // Construir consulta base
    $sql = "SELECT 
                l.id, 
                l.nombre, 
                l.descripcion, 
                l.direccion, 
                l.categoria, 
                l.telefono, 
                l.precio_promedio,
                p.nombre as provincia_nombre
            FROM lugares l 
            JOIN provincias p ON l.provincia_id = p.id 
            WHERE l.provincia_id = :provincia_id";
    
    // Agregar filtro por categoría si se especifica
    if ($categoria && in_array($categoria, ['restaurante', 'turistico', 'ocio'])) {
        $sql .= " AND l.categoria = :categoria";
    }
    
    $sql .= " ORDER BY l.nombre";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':provincia_id', $provincia_id, PDO::PARAM_INT);
    
    if ($categoria && in_array($categoria, ['restaurante', 'turistico', 'ocio'])) {
        $stmt->bindParam(':categoria', $categoria);
    }
    
    $stmt->execute();
    $lugares = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Obtener nombre de la provincia
    $stmt_provincia = $pdo->prepare("SELECT nombre FROM provincias WHERE id = :id");
    $stmt_provincia->bindParam(':id', $provincia_id);
    $stmt_provincia->execute();
    $provincia_nombre = $stmt_provincia->fetchColumn();
    
    sendResponse([
        'success' => true,
        'data' => $lugares,
        'provincia' => $provincia_nombre,
        'total' => count($lugares),
        'filtro' => $categoria
    ]);
    
} catch(Exception $e) {
    sendResponse([
        'success' => false,
        'error' => 'Error al obtener lugares: ' . $e->getMessage()
    ], 500);
}
?>