# 🗄️ Guía de Acceso a la Base de Datos MongoDB

Este documento explica cómo acceder y consultar la base de datos MongoDB del formulario de contacto.

## 📋 Información de la Base de Datos

- **Base de Datos**: `formulario_db`
- **Colección**: `formularios`
- **Puerto MongoDB**: `27017`
- **Usuario Admin**: `admin`
- **Contraseña Admin**: `password123`

## 🌐 Acceso Web con Mongo Express

### Interfaz Web Completa
- **URL**: http://localhost:8081
- **Usuario**: admin
- **Contraseña**: admin123

Esta interfaz web te permite:
- ✅ Ver todas las bases de datos
- ✅ Explorar colecciones
- ✅ Ejecutar consultas
- ✅ Agregar, editar y eliminar documentos
- ✅ Ver estadísticas

### Pasos para acceder:
1. Asegúrate que Docker esté ejecutando MongoDB:
   ```bash
   docker-compose up -d mongodb mongo-express
   ```
2. Abre tu navegador en: http://localhost:8081
3. Ingresa las credenciales (admin/admin123)
4. Navega a `formulario_db` → `formularios`

## 💻 Acceso por Terminal

### 1. Acceso directo al contenedor
```bash
# Conectar al contenedor de MongoDB
docker exec -it formulario_mongodb mongosh

# Dentro de mongosh:
use formulario_db
db.auth('admin', 'password123')
db.formularios.find().pretty()
```

### 2. Conexión desde terminal local
```bash
# Si tienes MongoDB instalado localmente
mongosh "mongodb://admin:password123@localhost:27017/formulario_db?authSource=admin"

# Consultas útiles:
db.formularios.find()                    # Ver todos los formularios
db.formularios.count()                   # Contar documentos
db.formularios.find().sort({fechaCreacion: -1}) # Ordenar por fecha
```

## 🔍 Consultas Útiles de MongoDB

### Consultas Básicas
```javascript
// Ver todos los formularios
db.formularios.find().pretty()

// Buscar por nombre
db.formularios.find({nombre: /pablo/i})

// Buscar por email
db.formularios.find({email: "test@example.com"})

// Formularios de hoy
db.formularios.find({
  fechaCreacion: {
    $gte: new Date(new Date().setHours(0,0,0,0))
  }
})

// Contar formularios por día
db.formularios.aggregate([
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$fechaCreacion"
        }
      },
      count: {$sum: 1}
    }
  },
  {$sort: {_id: -1}}
])
```

### Consultas Avanzadas
```javascript
// Estadísticas por dominio de email
db.formularios.aggregate([
  {
    $group: {
      _id: {
        $arrayElemAt: [
          {$split: ["$email", "@"]}, 1
        ]
      },
      count: {$sum: 1}
    }
  },
  {$sort: {count: -1}}
])

// Formularios más recientes (últimos 10)
db.formularios.find().sort({fechaCreacion: -1}).limit(10)

// Buscar por contenido en mensaje
db.formularios.find({
  mensaje: {$regex: "palabra_clave", $options: "i"}
})
```

## 🌐 API REST Endpoints

La aplicación también expone endpoints para consultar datos:

### GET /formularios
- **URL**: http://localhost:3000/formularios
- **Parámetros**:
  - `limit`: Número de resultados (default: 10)
  - `page`: Página (default: 1)
- **Ejemplo**: http://localhost:3000/formularios?limit=20&page=1

### Respuesta JSON:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "nombre": "Juan Pérez",
      "email": "juan@email.com",
      "telefono": "+1234567890",
      "mensaje": "Hola, me interesa...",
      "fechaCreacion": "2025-09-25T20:57:42.133Z",
      "ip": "127.0.0.1"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 10
  }
}
```

## 🛠️ Herramientas Recomendadas

### Para Desarrollo
1. **MongoDB Compass** (GUI Desktop)
   - Descarga: https://www.mongodb.com/products/compass
   - Conexión: `mongodb://admin:password123@localhost:27017/formulario_db?authSource=admin`

2. **Studio 3T** (GUI Avanzada)
   - Descarga: https://studio3t.com/
   - Funciones avanzadas de consulta y análisis

3. **VS Code Extensions**
   - MongoDB for VS Code
   - MongoDB Snippets

## 🔧 Comandos Docker Útiles

```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs de MongoDB
docker logs formulario_mongodb

# Ver logs de Mongo Express
docker logs formulario_mongo_express

# Reiniciar servicios
docker-compose restart

# Parar servicios
docker-compose down

# Eliminar volúmenes (⚠️ ELIMINA TODOS LOS DATOS)
docker-compose down -v
```

## 📊 Monitoreo y Estadísticas

### En la aplicación web:
- **Panel de datos**: Lado derecho del formulario
- **Estadísticas en tiempo real**: Total y formularios de hoy
- **Actualización automática**: Cada 30 segundos

### Consultas de estadísticas:
```javascript
// Total de formularios
db.formularios.count()

// Formularios por mes
db.formularios.aggregate([
  {
    $group: {
      _id: {
        year: {$year: "$fechaCreacion"},
        month: {$month: "$fechaCreacion"}
      },
      count: {$sum: 1}
    }
  }
])

// Promedio de caracteres en mensajes
db.formularios.aggregate([
  {
    $group: {
      _id: null,
      avgLength: {$avg: {$strLenCP: "$mensaje"}}
    }
  }
])
```

## 🚨 Troubleshooting

### Problemas Comunes
1. **No puedo conectar a MongoDB**
   - Verifica que Docker esté corriendo: `docker ps`
   - Reinicia los servicios: `docker-compose restart`

2. **Mongo Express no carga**
   - Verifica que MongoDB esté ejecutándose primero
   - Revisa logs: `docker logs formulario_mongo_express`

3. **Error de autenticación**
   - Verifica credenciales en docker-compose.yml
   - Usuario: admin, Contraseña: password123

### Logs útiles
```bash
# Ver todos los logs
docker-compose logs

# Solo MongoDB
docker-compose logs mongodb

# Solo la aplicación
docker-compose logs app
```

---

## 📝 Resumen de Accesos

| Método | URL/Comando | Credenciales | Descripción |
|--------|-------------|--------------|-------------|
| **Web** | http://localhost:8081 | admin/admin123 | Interfaz completa de MongoDB |
| **API** | http://localhost:3000/formularios | - | Endpoint JSON de datos |
| **Terminal** | `docker exec -it formulario_mongodb mongosh` | admin/password123 | Acceso directo por consola |
| **App** | http://localhost:3000 | - | Panel lateral con datos en tiempo real |

¡Usa el método que más te convenga para explorar y gestionar los datos! 🚀