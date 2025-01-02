<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## EJECUTAR EN DESARROLLO

1. Clonar el repositorio
2. Instalar dependencias

```bash
$ npm install
```

3. Tener Nest CLi instalado (preferentemente de manera global):

```bash
$ npm i -g @nestjs/cli

```

4. Levantar la base de datos (Asegurarse de tener instalado docker)

```bash
$ docker-compose up -d
```

5. Reconstruir la base de datos con la semilla

```bash
http://localhost:3000/api/v2/seed
```

6. Configurar las variables de entorno creando el archivo **.env** basandose del arhcivo **.env-template**

# Build de produccion para la imagen de docker

1. Crear el archivo **_ .env.prod _** y llenar las variables

2. crear la nueva imagen

```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

3.Correr la imagen de docker

```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
```

## Compilar y levantar proyecto en desarrollo y produccion

```bash
# Desarrollo
$ npm run start

# Desarrollo
$ npm run dev

# Produccion
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
