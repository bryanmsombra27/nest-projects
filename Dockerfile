# Usa una imagen base de Node.js
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY package.json  ./

# Instala las dependencias
RUN npm install 

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usa NestJS (por defecto 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm","run","start"]