<?php
require_once 'config.php';

try {
    $pdo = getConnection();
    
    // Consulta para obtener todas las provincias
    $sql = "SELECT id, nombre, descripcion FROM provincias ORDER BY nombre";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $provincias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse([
        'success' => true,
        'data' => $provincias,
        'total' => count($provincias)
    ]);
    
} catch(Exception $e) {
    sendResponse([
        'success' => false,
        'error' => 'Error al obtener provincias: ' . $e->getMessage()
    ], 500);
}
?>