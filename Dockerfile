# Etapa de construcción
FROM node:18-alpine as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
# Usamos npm install en lugar de npm ci para asegurar que node_modules se cree correctamente
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
# Usamos npx para ejecutar vite directamente en lugar de usar el script del package.json
RUN npx vite build

# Etapa de producción - usando Node.js en lugar de Nginx
FROM node:18-alpine

# Crear directorio de la aplicación
WORKDIR /app

# Instalar un servidor HTTP simple
RUN npm install -g serve

# Copiar los archivos de distribución desde la etapa de construcción
COPY --from=build /app/dist /app

# Exponer puerto 8080
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["serve", "-s", ".", "-l", "8080"]
