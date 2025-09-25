// Endpoint simulado para mostrar datos de ejemplo en Vercel

export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const { limit = 10, page = 1 } = req.query;
            
            // Datos de ejemplo para el demo
            const datosEjemplo = [
                {
                    _id: "demo_1",
                    nombre: "María García",
                    email: "maria@example.com",
                    telefono: "+1-555-0123",
                    mensaje: "Hola, me interesa obtener más información sobre sus servicios. ¿Podrían contactarme?",
                    fechaCreacion: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutos atrás
                    ip: "demo"
                },
                {
                    _id: "demo_2",
                    nombre: "Carlos Rodríguez",
                    email: "carlos@example.com",
                    telefono: "+1-555-0456",
                    mensaje: "Excelente formulario. Me gusta mucho el diseño y la funcionalidad.",
                    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
                    ip: "demo"
                },
                {
                    _id: "demo_3",
                    nombre: "Ana López",
                    email: "ana@example.com",
                    telefono: "+1-555-0789",
                    mensaje: "¿Tienen servicios de consultoría? Necesito ayuda con un proyecto similar.",
                    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 horas atrás
                    ip: "demo"
                },
                {
                    _id: "demo_4",
                    nombre: "Luis Martínez",
                    email: "luis@example.com",
                    telefono: "+1-555-0321",
                    mensaje: "Impresionante trabajo con Node.js y MongoDB. ¿Es código abierto?",
                    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 día atrás
                    ip: "demo"
                },
                {
                    _id: "demo_5",
                    nombre: "Sofia Chen",
                    email: "sofia@example.com",
                    telefono: "+1-555-0654",
                    mensaje: "Me encanta el diseño responsivo y las animaciones. ¡Muy profesional!",
                    fechaCreation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 días atrás
                    ip: "demo"
                }
            ];

            // Simular paginación
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + parseInt(limit);
            const paginatedData = datosEjemplo.slice(startIndex, endIndex);

            res.status(200).json({
                success: true,
                data: paginatedData,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(datosEjemplo.length / limit),
                    totalItems: datosEjemplo.length,
                    itemsPerPage: parseInt(limit)
                },
                demo: true,
                message: "Estos son datos de ejemplo para demostración"
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                errors: ['Error al consultar los formularios']
            });
        }
    } else {
        res.status(405).json({
            success: false,
            message: 'Método no permitido'
        });
    }
}