# 📝 Formulario de Contacto - Node.js

Una aplicación web moderna con un formulario de contacto elegante, desarrollada con Node.js, Express y tecnologías web modernas.

## ✨ Características

- **🎨 Diseño Moderno**: Interfaz atractiva con gradientes, animaciones y efectos visuales
- **📱 Responsive**: Se adapta perfectamente a dispositivos móviles y desktop
- **⚡ Validación en Tiempo Real**: Validaciones inmediatas mientras el usuario escribe
- **🔒 Seguridad**: Implementa Helmet para headers de seguridad y validaciones del servidor
- **🎯 UX Mejorada**: Efectos visuales, loading states y feedback inmediato
- **✅ Estabilidad**: Manejo robusto de errores y validaciones dobles (cliente/servidor)

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Pasos de instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```
   
   O en modo producción:
   ```bash
   npm start
   ```

3. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
FORMULARIO/
├── server.js              # Servidor Express principal
├── package.json           # Configuración y dependencias
├── .gitignore            # Archivos ignorados por Git
├── README.md             # Documentación
└── public/               # Archivos estáticos
    ├── index.html        # Página principal
    ├── css/
    │   └── styles.css    # Estilos CSS modernos
    └── js/
        └── script.js     # JavaScript para interactividad
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web rápido y minimalista
- **Helmet**: Middleware de seguridad
- **Body-parser**: Parsing de datos del formulario
- **CORS**: Manejo de políticas de origen cruzado

### Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: Estilos avanzados con CSS Grid, Flexbox y animaciones
- **JavaScript ES6+**: Interactividad y validaciones
- **Google Fonts**: Tipografía moderna (Inter)

## 🎯 Funcionalidades del Formulario

### Campos Incluidos
- **Nombre**: Validación de longitud y caracteres permitidos
- **Email**: Validación de formato de email
- **Teléfono**: Validación de formato telefónico internacional
- **Mensaje**: Validación de longitud con contador de caracteres

### Validaciones
- **Cliente**: Validación en tiempo real mientras se escribe
- **Servidor**: Validación adicional para mayor seguridad
- **Visual**: Feedback inmediato con colores y mensajes

### Efectos Visuales
- Animaciones de entrada suaves
- Estados de hover y focus
- Loading spinner durante envío
- Efecto confetti al completar exitosamente
- Transiciones fluidas

## ⚙️ Configuración

### Variables de Entorno
Puedes configurar el puerto creando un archivo `.env`:
```
PORT=3000
```

### Personalización
- **Colores**: Modifica las variables CSS en `styles.css`
- **Validaciones**: Ajusta las expresiones regulares en `script.js`
- **Procesamiento**: Modifica el endpoint `/submit-form` en `server.js`

## 🔒 Seguridad

La aplicación incluye varias medidas de seguridad:
- Headers de seguridad con Helmet
- Validación doble (cliente y servidor)
- Sanitización de datos de entrada
- Protección contra inyecciones
- CORS configurado
- Rate limiting implícito

## 📊 API Endpoints

### POST `/submit-form`
Procesa los datos del formulario.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "+1234567890",
  "mensaje": "Mensaje de contacto"
}
```

**Response (Éxito):**
```json
{
  "success": true,
  "message": "¡Formulario enviado correctamente! Te contactaremos pronto."
}
```

**Response (Error):**
```json
{
  "success": false,
  "errors": ["Lista de errores de validación"]
}
```

## 🚀 Próximas Mejoras

- [ ] Base de datos para almacenar contactos
- [ ] Sistema de notificaciones por email
- [ ] Panel de administración
- [ ] Captcha anti-spam
- [ ] Múltiples idiomas
- [ ] API REST completa

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes algún problema o pregunta, puedes:
- Abrir un issue en GitHub
- Contactar al desarrollador

---

**¡Gracias por usar este formulario de contacto! 🎉**