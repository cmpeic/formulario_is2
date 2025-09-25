const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/formulario_db?authSource=admin';
        
        const conn = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        
        // Manejar eventos de conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de conexión a MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB desconectado');
        });

        // Cerrar conexión cuando la aplicación se cierre
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔒 Conexión a MongoDB cerrada');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;