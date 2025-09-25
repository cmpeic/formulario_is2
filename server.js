require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const Formulario = require('./models/Formulario');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

// CORS
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conectar a la base de datos
connectDB();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal - servir el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para procesar el formulario
app.post('/submit-form', async (req, res) => {
    try {
        const { nombre, email, telefono, mensaje } = req.body;
        
        // Obtener la IP del cliente
        const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        
        // Crear el documento del formulario
        const nuevoFormulario = new Formulario({
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            telefono: telefono.trim(),
            mensaje: mensaje.trim(),
            ip: clientIP
        });
        
        // Guardar en MongoDB (las validaciones se ejecutan automáticamente)
        await nuevoFormulario.save();
        
        console.log('✅ Formulario guardado en BD:', {
            id: nuevoFormulario._id,
            nombre: nuevoFormulario.nombre,
            email: nuevoFormulario.email,
            fecha: nuevoFormulario.fechaCreacion
        });
        
        res.json({
            success: true,
            message: '¡Formulario enviado correctamente! Te contactaremos pronto.',
            id: nuevoFormulario._id
        });
        
    } catch (error) {
        console.error('❌ Error al procesar formulario:', error);
        
        // Si es un error de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                errors: errors
            });
        }
        
        // Error genérico del servidor
        res.status(500).json({
            success: false,
            errors: ['Error interno del servidor. Por favor intente más tarde.']
        });
    }
});

// Endpoint para consultar formularios (útil para administración)
app.get('/formularios', async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const skip = (page - 1) * limit;
        
        const formularios = await Formulario.find()
            .sort({ fechaCreacion: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .select('-__v'); // Excluir el campo __v de mongoose
        
        const total = await Formulario.countDocuments();
        
        res.json({
            success: true,
            data: formularios,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('❌ Error al consultar formularios:', error);
        res.status(500).json({
            success: false,
            errors: ['Error al consultar los formularios']
        });
    }
});

// Funciones de validación
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    return phoneRegex.test(phone);
}

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📝 Formulario disponible en: http://localhost:${PORT}`);
});

module.exports = app;