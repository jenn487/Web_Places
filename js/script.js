// Variables globales
let provinciaActual = null;
let lugaresData = [];
let filtroActivo = '';

const API_BASE = 'php/';

function mostrarElemento(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
}

function ocultarElemento(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}


function mostrarLoading() {
    mostrarElemento('loading');
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        
        ocultarElemento('provincias-grid');
        ocultarElemento('error-message');
    } else if (currentPage === 'provincia.html') {
        
        ocultarElemento('lugares-grid');
        ocultarElemento('error-message');
        ocultarElemento('no-results');
    }
}


function mostrarError(mensaje = 'Error al cargar los datos') {
    ocultarElemento('loading');
    mostrarElemento('error-message');
    
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        const p = errorElement.querySelector('p');
        if (p) {
            p.textContent = mensaje;
        }
    }
}

async function hacerPeticion(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Error desconocido');
        }
        return data;
    } catch (error) {
        console.error('Error en petición:', error);
        throw error;
    }
}

async function cargarProvincias() {
    console.log('Iniciando carga de provincias...');
    mostrarLoading();
    
    try {
        const data = await hacerPeticion(`${API_BASE}get_provincias.php`);
        console.log('Datos recibidos:', data);
        
        if (data.data && data.data.length > 0) {
            mostrarProvincias(data.data);
        } else {
            mostrarError('No se encontraron provincias');
        }
    } catch (error) {
        mostrarError('Error al cargar las provincias. Verifica tu conexión y que WAMP esté funcionando.');
        console.error('Error completo:', error);
    }
}


function mostrarProvincias(provincias) {
    const grid = document.getElementById('provincias-grid');
    if (!grid) {
        console.error('Elemento provincias-grid no encontrado');
        return;
    }
    
    grid.innerHTML = '';
    
    provincias.forEach(provincia => {
        const card = document.createElement('a');
        card.href = `provincia.html?id=${provincia.id}`;
        card.className = 'provincia-card';
        card.innerHTML = `
            <h3>${provincia.nombre}</h3>
            <p>${provincia.descripcion}</p>
        `;
        grid.appendChild(card);
    });
    
    ocultarElemento('loading');
    mostrarElemento('provincias-grid');
    console.log(`Mostrando ${provincias.length} provincias`);
}

function obtenerParametroURL(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// cargar lugares por provincia
async function cargarLugares(categoria = '') {
    mostrarLoading();
    
    const provinciaId = obtenerParametroURL('id');
    if (!provinciaId) {
        mostrarError('ID de provincia no válido');
        return;
    }
    
    try {
        let url = `${API_BASE}get_lugares.php?provincia_id=${provinciaId}`;
        if (categoria) {
            url += `&categoria=${categoria}`;
        }
        
        const data = await hacerPeticion(url);
        lugaresData = data.data;
        filtroActivo = categoria;
        
        // Actualizar nombre de provincia
        const nombreElement = document.getElementById('provincia-nombre');
        if (nombreElement && data.provincia) {
            nombreElement.textContent = data.provincia;
        }
        
        mostrarLugares(data.data);
    } catch (error) {
        mostrarError('Error al cargar los lugares. Verifica tu conexión.');
        console.error('Error:', error);
    }
}

// mostrar lugares
function mostrarLugares(lugares) {
    const grid = document.getElementById('lugares-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (lugares.length === 0) {
        ocultarElemento('loading');
        mostrarElemento('no-results');
        return;
    }
    
    lugares.forEach(lugar => {
        const card = document.createElement('div');
        card.className = 'lugar-card';
        card.onclick = () => mostrarDetallesLugar(lugar);
        
        const categoriaClass = `categoria-${lugar.categoria}`;
        const categoriaTexto = {
            'restaurante': 'Restaurante',
            'turistico': 'Turístico',
            'ocio': 'Ocio'
        };
        
        card.innerHTML = `
            <h3>${lugar.nombre}</h3>
            <span class="lugar-categoria ${categoriaClass}">
                ${categoriaTexto[lugar.categoria] || lugar.categoria}
            </span>
            <p class="lugar-descripcion">${lugar.descripcion || 'Descripción no disponible'}</p>
            <div class="lugar-info">
                ${lugar.direccion ? `
                    <div class="info-item">
                        <strong>📍</strong> ${lugar.direccion}
                    </div>
                ` : ''}
                ${lugar.telefono ? `
                    <div class="info-item">
                        <strong>📞</strong> ${lugar.telefono}
                    </div>
                ` : ''}
                ${lugar.precio_promedio ? `
                    <div class="info-item">
                        <strong>💰</strong> ${lugar.precio_promedio}
                    </div>
                ` : ''}
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    ocultarElemento('loading');
    ocultarElemento('no-results');
    mostrarElemento('lugares-grid');
}

// mostrar detalles del lugar en modal
function mostrarDetallesLugar(lugar) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    const categoriaTexto = {
        'restaurante': 'Restaurante',
        'turistico': 'Sitio Turístico',
        'ocio': 'Ocio'
    };
    
    modalBody.innerHTML = `
        <h2>${lugar.nombre}</h2>
        <p><strong>Categoría:</strong> ${categoriaTexto[lugar.categoria] || lugar.categoria}</p>
        <p><strong>Descripción:</strong> ${lugar.descripcion || 'No disponible'}</p>
        ${lugar.direccion ? `<p><strong>Dirección:</strong> ${lugar.direccion}</p>` : ''}
        ${lugar.telefono ? `<p><strong>Teléfono:</strong> ${lugar.telefono}</p>` : ''}
        ${lugar.precio_promedio ? `<p><strong>Precio Promedio:</strong> ${lugar.precio_promedio}</p>` : ''}
        <p><strong>Provincia:</strong> ${lugar.provincia_nombre}</p>
    `;
    
    modal.style.display = 'block';
}


function configurarFiltros() {
    const filtros = document.querySelectorAll('.filtro-btn');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
        
            filtros.forEach(f => f.classList.remove('active'));
            
            filtro.classList.add('active');
            
            const categoria = filtro.dataset.categoria;

            cargarLugares(categoria);
        });
    });
}


function configurarModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    if (!modal || !closeBtn) return;
    
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('Página actual:', currentPage); 
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/' || currentPage === 'wheretogo') {
        
        console.log('Cargando provincias...');
        cargarProvincias();
    } else if (currentPage === 'provincia.html') {
        
        console.log('Configurando página de provincia...');
        configurarFiltros();
        configurarModal();
        cargarLugares();
    }
});


function reintentarCarga() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        cargarProvincias();
    } else if (currentPage === 'provincia.html') {
        cargarLugares(filtroActivo);
    }
}

window.cargarProvincias = cargarProvincias;
window.cargarLugares = cargarLugares;
window.reintentarCarga = reintentarCarga;