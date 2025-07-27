# Usar Node.js 20 como imagen base
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias con más tiempo de timeout
RUN npm install --timeout=600000

# Copiar resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Instalar servidor estático
RUN npm install -g serve

# Exponer puerto
EXPOSE 5000

# Comando para ejecutar
CMD ["serve", "-s", "dist", "-l","--host=0.0.0.0", "--port=5000"]
