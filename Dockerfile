# Usa una imagen base de Node.js
FROM node:22

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos del proyecto
COPY . .

# Instala las dependencias
RUN npm install

# Expón el puerto que usa la aplicación
EXPOSE 80

# Define el comando para arrancar la app
CMD ["npm", "start"]