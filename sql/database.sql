-- Base de datos para WhereToGo
USE wheretogo;

-- Tabla de provincias
CREATE TABLE provincias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de lugares
CREATE TABLE lugares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(300),
    categoria ENUM('restaurante', 'turistico', 'ocio') NOT NULL,
    provincia_id INT,
    telefono VARCHAR(20),
    precio_promedio VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provincia_id) REFERENCES provincias(id)
);

-- Insertar datos de ejemplo
INSERT INTO provincias (nombre, descripcion) VALUES 
('Santo Domingo', 'Capital de la República Dominicana'),
('Santiago', 'Ciudad Corazón de la República Dominicana'),
('La Romana', 'Ciudad turística del Este'),
('Puerto Plata', 'Provincia costera del Norte'),
('Punta Cana', 'Destino turístico internacional');

-- Insertar lugares de ejemplo
INSERT INTO lugares (nombre, descripcion, direccion, categoria, provincia_id, telefono, precio_promedio) VALUES 
-- Santo Domingo
('Mesón D''Bari', 'Restaurante de comida típica dominicana', 'Calle Hostos, Zona Colonial', 'restaurante', 1, '809-687-4091', '$15-25'),
('Catedral Primada', 'Primera catedral construida en América', 'Calle Isabel la Católica, Zona Colonial', 'turistico', 1, NULL, 'Gratis'),
('Hard Rock Cafe', 'Bar y restaurante temático', 'Blue Mall, Santo Domingo', 'ocio', 1, '809-955-1111', '$20-35'),

-- Santiago
('El Típico Bonao', 'Comida criolla tradicional', 'Av. Juan Pablo Duarte, Santiago', 'restaurante', 2, '809-582-5555', '$12-20'),
('Monumento a los Héroes', 'Monumento histórico de Santiago', 'Centro de Santiago', 'turistico', 2, NULL, 'Gratis'),
('Discoteca Jet Set', 'Vida nocturna santiaguera', 'Av. Estrella Sadhalá', 'ocio', 2, '809-575-8888', '$10-15'),

-- La Romana
('Casa de Campo Marina', 'Resort y marina de lujo', 'Casa de Campo', 'turistico', 3, '809-523-3333', '$50+'),
('Captain Cook', 'Restaurante de mariscos', 'Bayahíbe', 'restaurante', 3, '809-833-0001', '$25-40'),
('Altos de Chavón', 'Villa artística y cultural', 'Casa de Campo', 'turistico', 3, NULL, '$15'),

-- Puerto Plata
('Long Beach', 'Bar en la playa', 'Costa Dorada', 'ocio', 4, '809-320-1111', '$8-15'),
('Teleférico Puerto Plata', 'Teleférico al Monte Isabel de Torres', 'Puerto Plata', 'turistico', 4, '809-970-0501', '$12'),
('La Parrilla Steak House', 'Especialidad en carnes', 'Malecón de Puerto Plata', 'restaurante', 4, '809-586-2121', '$18-30'),

-- Punta Cana
('Jellyfish Restaurant', 'Restaurante gourmet en la playa', 'Cap Cana', 'restaurante', 5, '809-469-7469', '$40-60'),
('Hoyo Azul', 'Cenote natural para nadar', 'Cap Cana', 'turistico', 5, NULL, '$25'),
('Coco Bongo', 'Show y vida nocturna', 'Punta Cana', 'ocio', 5, '809-466-1111', '$70-90');