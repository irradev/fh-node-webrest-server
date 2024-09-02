# Dev

1. Clonar el .env.template y crear el .env
2. Ejecutar el comando ```docker compose up -d```



# Prod BD
    - PostgreSQL
        1. Crear una base de datos en producción
        2. Capturar la url de conexión
        3. Cambiar el valor de la variable de entorno (.env) POSTGRES_URL por el valor de producción
        4. En caso de error: ejecutar el comando ```npm run prisma:migrate:prod``` para crear las tablas