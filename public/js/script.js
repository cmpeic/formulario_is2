// Elementos del DOM
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const resultMessage = document.getElementById('resultMessage');
const resultIcon = document.getElementById('resultIcon');
const resultText = document.getElementById('resultText');
const mensajeCount = document.getElementById('mensaje-count');

// Campos del formulario
const campos = {
    nombre: document.getElementById('nombre'),
    email: document.getElementById('email'),
    telefono: document.getElementById('telefono'),
    mensaje: document.getElementById('mensaje')
};

// Elementos de error
const errores = {
    nombre: document.getElementById('nombre-error'),
    email: document.getElementById('email-error'),
    telefono: document.getElementById('telefono-error'),
    mensaje: document.getElementById('mensaje-error')
};

// Expresiones regulares para validación
const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^[\+]?[0-9\s\-\(\)]{8,15}$/,
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/
};

// Estado de validación
let validacion = {
    nombre: false,
    email: false,
    telefono: false,
    mensaje: false
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventListeners();
    actualizarContadorCaracteres();
});

function inicializarEventListeners() {
    // Validación en tiempo real
    Object.keys(campos).forEach(campo => {
        campos[campo].addEventListener('input', () => validarCampo(campo));
        campos[campo].addEventListener('blur', () => validarCampo(campo));
        campos[campo].addEventListener('focus', () => limpiarError(campo));
    });

    // Contador de caracteres para mensaje
    campos.mensaje.addEventListener('input', actualizarContadorCaracteres);

    // Envío del formulario
    form.addEventListener('submit', manejarEnvioFormulario);

    // Efectos visuales
    Object.values(campos).forEach(campo => {
        campo.addEventListener('focus', (e) => {
            e.target.parentElement.style.transform = 'scale(1.02)';
        });
        
        campo.addEventListener('blur', (e) => {
            e.target.parentElement.style.transform = 'scale(1)';
        });
    });
}

function validarCampo(campo) {
    const valor = campos[campo].value.trim();
    let esValido = false;
    let mensajeError = '';

    switch (campo) {
        case 'nombre':
            if (!valor) {
                mensajeError = 'El nombre es obligatorio';
            } else if (valor.length < 2) {
                mensajeError = 'El nombre debe tener al menos 2 caracteres';
            } else if (valor.length > 50) {
                mensajeError = 'El nombre no puede tener más de 50 caracteres';
            } else if (!regex.nombre.test(valor)) {
                mensajeError = 'El nombre solo puede contener letras y espacios';
            } else {
                esValido = true;
            }
            break;

        case 'email':
            if (!valor) {
                mensajeError = 'El email es obligatorio';
            } else if (!regex.email.test(valor)) {
                mensajeError = 'Por favor ingrese un email válido';
            } else {
                esValido = true;
            }
            break;

        case 'telefono':
            if (!valor) {
                mensajeError = 'El teléfono es obligatorio';
            } else if (!regex.telefono.test(valor)) {
                mensajeError = 'Por favor ingrese un teléfono válido';
            } else {
                esValido = true;
            }
            break;

        case 'mensaje':
            if (!valor) {
                mensajeError = 'El mensaje es obligatorio';
            } else if (valor.length < 10) {
                mensajeError = 'El mensaje debe tener al menos 10 caracteres';
            } else if (valor.length > 500) {
                mensajeError = 'El mensaje no puede tener más de 500 caracteres';
            } else {
                esValido = true;
            }
            break;
    }

    validacion[campo] = esValido;
    mostrarError(campo, mensajeError, !esValido);
    actualizarEstadoBoton();
    
    return esValido;
}

function mostrarError(campo, mensaje, mostrar) {
    const elementoError = errores[campo];
    const elementoCampo = campos[campo];

    if (mostrar && mensaje) {
        elementoError.textContent = mensaje;
        elementoError.classList.add('show');
        elementoCampo.classList.add('error');
        
        // Vibración sutil en móviles
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    } else {
        elementoError.classList.remove('show');
        elementoCampo.classList.remove('error');
        setTimeout(() => {
            if (!elementoError.classList.contains('show')) {
                elementoError.textContent = '';
            }
        }, 200);
    }
}

function limpiarError(campo) {
    errores[campo].classList.remove('show');
    campos[campo].classList.remove('error');
}

function actualizarContadorCaracteres() {
    const longitud = campos.mensaje.value.length;
    mensajeCount.textContent = longitud;
    
    // Cambiar color según proximidad al límite
    if (longitud > 450) {
        mensajeCount.style.color = 'var(--error-color)';
    } else if (longitud > 350) {
        mensajeCount.style.color = 'var(--warning-color)';
    } else {
        mensajeCount.style.color = 'var(--text-light)';
    }
}

function actualizarEstadoBoton() {
    const todosValidos = Object.values(validacion).every(valido => valido);
    submitBtn.disabled = !todosValidos;
    
    if (todosValidos) {
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    } else {
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
    }
}

async function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    // Validar todos los campos una vez más
    let todosValidos = true;
    Object.keys(campos).forEach(campo => {
        if (!validarCampo(campo)) {
            todosValidos = false;
        }
    });

    if (!todosValidos) {
        mostrarMensaje('Por favor corrige los errores antes de enviar', 'error');
        return;
    }

    // Mostrar estado de carga
    mostrarCargando(true);
    ocultarMensaje();

    try {
        // Preparar datos
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());

        // Simular delay para mostrar loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch('/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (response.ok && resultado.success) {
            mostrarMensaje(resultado.message, 'success');
            limpiarFormulario();
            
            // Confetti effect
            crearEfectoConfetti();
            
        } else {
            const errores = resultado.errors || ['Error desconocido'];
            mostrarMensaje(errores.join(', '), 'error');
        }

    } catch (error) {
        console.error('Error al enviar formulario:', error);
        mostrarMensaje('Error de conexión. Por favor intenta más tarde.', 'error');
    } finally {
        mostrarCargando(false);
    }
}

function mostrarCargando(mostrar) {
    if (mostrar) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        actualizarEstadoBoton();
    }
}

function mostrarMensaje(mensaje, tipo) {
    resultText.textContent = mensaje;
    resultIcon.textContent = tipo === 'success' ? '✅' : '❌';
    resultMessage.className = `result-message ${tipo}`;
    resultMessage.style.display = 'block';
    
    // Scroll al mensaje
    resultMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

function ocultarMensaje() {
    resultMessage.style.display = 'none';
}

function limpiarFormulario() {
    form.reset();
    
    // Resetear validaciones
    Object.keys(validacion).forEach(campo => {
        validacion[campo] = false;
        limpiarError(campo);
    });
    
    actualizarContadorCaracteres();
    actualizarEstadoBoton();
    
    // Efecto visual
    form.style.transform = 'scale(0.98)';
    setTimeout(() => {
        form.style.transform = 'scale(1)';
    }, 200);
}

function crearEfectoConfetti() {
    // Crear partículas de confetti
    for (let i = 0; i < 50; i++) {
        crearParticula();
    }
}

function crearParticula() {
    const particula = document.createElement('div');
    particula.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)]};
        top: -10px;
        left: ${Math.random() * 100}vw;
        z-index: 1000;
        border-radius: 50%;
        pointer-events: none;
        animation: caer 3s linear forwards;
    `;
    
    document.body.appendChild(particula);
    
    // Eliminar después de la animación
    setTimeout(() => {
        particula.remove();
    }, 3000);
}

// CSS para animación de confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes caer {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});

// Prevenir envío múltiple
let enviando = false;
form.addEventListener('submit', function(e) {
    if (enviando) {
        e.preventDefault();
        return false;
    }
    enviando = true;
    setTimeout(() => {
        enviando = false;
    }, 3000);
});