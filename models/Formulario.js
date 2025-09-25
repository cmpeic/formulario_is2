const mongoose = require('mongoose');

const formularioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minLength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxLength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true,
        match: [/^[\d\s\-\+\(\)]+$/, 'Teléfono inválido']
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje es obligatorio'],
        trim: true,
        minLength: [10, 'El mensaje debe tener al menos 10 caracteres'],
        maxLength: [500, 'El mensaje no puede exceder 500 caracteres']
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    ip: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Esto agrega automáticamente createdAt y updatedAt
});

// Índices para mejorar las consultas
formularioSchema.index({ email: 1 });
formularioSchema.index({ fechaCreacion: -1 });

module.exports = mongoose.model('Formulario', formularioSchema);