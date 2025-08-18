<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header('Location: login.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Administración</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <h1>Panel de Administración</h1>

        <form action="agregar_lugar.php" method="POST">
            <h2>Agregar Lugar</h2>
            <input type="text" name="nombre" placeholder="Nombre" required>
            <input type="text" name="direccion" placeholder="Dirección" required>
            <select name="categoria">
                <option value="restaurante">Restaurante</option>
                <option value="turistico">Turístico</option>
                <option value="ocio">Ocio</option>
            </select>
            <input type="number" name="provincia_id" placeholder="ID Provincia" required>
            <button type="submit">Agregar</button>
        </form>

        <hr>

        <h2>Editar / Eliminar Lugares</h2>
        
    </div>
</body>
</html>
