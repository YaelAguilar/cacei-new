# README - Proyecto de Analítica CACEI API

## Descripción
La API desarrollada a continuación está estructurada siguiendo los principios de la arquitectura hexagonal, lo que permite una integración eficiente y flexible con servicios externos, como el cliente Frontend disponible en el siguiente repositorio: https://github.com/alilopez37/CACEI_frontend.

Esta API ha sido diseñada exclusivamente para su uso en la Universidad Politécnica de Chiapas.

## Requisitos previos
- Node.js (versión 20.x o superior)
- npm (viene incluido con Node.js)


## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/alilopez37/CACEI_backend
cd CACEI_backend
```

2. Instala las dependencias:
```bash
npm i
```

3. Configura el archivo .env:
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
DB_HOST = ""
DB_USER = ""
DB_DATABASE = ""
DB_PASSWORD = ""

ACCESS_TOKEN_PRIVATE_KEY= TOKEN
PORT_SERVER= 4000
SALT=10
HTTP_ONLY= false
AVAILABLE_DOMAINS= http://localhost:5173,http://localhost:5174
```

## Ejecución del proyecto

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4000` (o el puerto que se asigne en las variables de entorno).

## Contacto
Ingeniería en Software - UPCHIAPAS
