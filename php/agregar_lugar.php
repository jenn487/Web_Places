<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header('Location: login.html');
    exit;
}

require_once 'config.php';
$pdo = getConnection();

$nombre = $_POST['nombre'];
$direccion = $_POST['direccion'];
$categoria = $_POST['categoria'];
$provincia_id = $_POST['provincia_id'];

$sql = "INSERT INTO lugares (nombre, direccion, categoria, provincia_id) VALUES (?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$nombre, $direccion, $categoria, $provincia_id]);

echo "<script>alert('Lugar agregado exitosamente'); window.location.href='admin-panel.php';</script>";
?>
