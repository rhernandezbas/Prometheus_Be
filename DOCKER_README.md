# Instrucciones para Docker

Este documento describe cómo construir y ejecutar la aplicación utilizando Docker.

## Requisitos previos

- Docker instalado en tu sistema
- Docker Compose (opcional, para configuración simplificada)

## Construcción de la imagen Docker

Para construir la imagen Docker de la aplicación, ejecuta el siguiente comando desde el directorio raíz del proyecto:

```bash
docker build -t sistema-educativo-frontend .
```

Este comando creará una imagen Docker llamada `sistema-educativo-frontend` utilizando el Dockerfile proporcionado.

## Ejecutar el contenedor

Una vez que la imagen se ha construido correctamente, puedes ejecutar la aplicación con el siguiente comando:

```bash
docker run -p 8090:8080 sistema-educativo-frontend
```

Esto iniciará un contenedor Docker y mapeará el puerto 8090 de tu máquina local al puerto 8080 del contenedor. La aplicación estará disponible en:

```
http://localhost:8090
```

## Uso con Docker Compose

Para simplificar la ejecución, puedes usar Docker Compose:

```bash
docker-compose up -d
```

El archivo `docker-compose.yml` está configurado para:
- Construir y ejecutar el contenedor frontend
- Mapear el puerto 8090 del host al puerto 8080 del contenedor
- Configurar la variable de entorno `VITE_API_URL` para apuntar al backend

## Configuración de variables de entorno

Si necesitas cambiar la URL del backend, puedes modificar la variable de entorno `VITE_API_URL`:

```bash
docker run -p 8090:8080 -e VITE_API_URL=http://otra-url:puerto sistema-educativo-frontend
```

## Notas importantes para despliegue

1. **Servidor HTTP ligero**: La aplicación utiliza `serve` (un servidor HTTP ligero basado en Node.js) para servir los archivos estáticos directamente, sin depender de Nginx.

2. **Puertos**: El contenedor Docker expone internamente el puerto 8080, que se mapea al puerto 8090 en el host.

3. **Acceso al backend**: La aplicación está configurada para conectarse al backend en `http://localhost:8080`.

## Personalización

- Para cambios en la aplicación, modifica los archivos fuente y reconstruye la imagen Docker.
