// Simulación del endpoint para Vercel (sin conexión real a BD)

export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { nombre, email, telefono, mensaje } = req.body;
            
            // Validaciones básicas
            const errors = [];
            
            if (!nombre || nombre.trim().length < 2) {
                errors.push('El nombre debe tener al menos 2 caracteres');
            }
            
            if (!email || !isValidEmail(email)) {
                errors.push('Por favor ingrese un email válido');
            }
            
            if (!telefono || !isValidPhone(telefono)) {
                errors.push('Por favor ingrese un teléfono válido');
            }
            
            if (!mensaje || mensaje.trim().length < 10) {
                errors.push('El mensaje debe tener al menos 10 caracteres');
            }
            
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    errors: errors
                });
            }

            // Simular guardado exitoso
            console.log('📝 Formulario recibido (demo):', {
                nombre: nombre.trim(),
                email: email.trim().toLowerCase(),
                telefono: telefono.trim(),
                mensaje: mensaje.trim(),
                fecha: new Date().toISOString(),
                nota: 'Este es un demo - datos no se guardan realmente'
            });

            res.status(200).json({
                success: true,
                message: '✅ ¡Formulario enviado correctamente! (Modo demo - datos no se guardan)',
                demo: true
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                errors: ['Error interno del servidor']
            });
        }
    } else {
        res.status(405).json({
            success: false,
            message: 'Método no permitido'
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    return phoneRegex.test(phone);
}