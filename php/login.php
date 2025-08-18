<?php
session_start();
require_once 'config.php';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if ($username === 'admin' && $password === 'admin123') {
    $_SESSION['admin'] = true;
    header('Location: php/admin-panel.php');
    exit;
} else {
    echo "<script>alert('Credenciales incorrectas'); window.location.href='login.html';</script>";
}
?>
