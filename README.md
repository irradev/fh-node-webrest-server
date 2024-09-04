# Dev

1. Clonar el .env.template y crear el .env
2. Ejecutar el comando ```docker compose up -d```


## Prod Railway
    - En producción, asegurarse de no enviar la variable de entorno PORT ya que esta variable la asigna Railway automáticamente.

## Prod BD

- **PostgreSQL**
    
    1. Crear una base de datos en producción
    2. Capturar la url de conexión
    3. Cambiar el valor de la variable de entorno (.env) POSTGRES_URL por el valor de producción
    4. En caso de error: ejecutar el comando ```npm run prisma:migrate:prod``` para crear las tablas




### Preparación para crear entorno para Testing

https://gist.github.com/Klerith/98d7b1bc0f1525e892f260813cad1007

Incluir archivo de configuración para testing en jest.config.ts:
``` 
setupFiles: ["<rootDir>/setupTests.ts"], 
```


### Arreglar error del linter en tsconfig.json

Añadir las siguientes reglas:

    {
        "exclude": [
            "node_modules",
            "dist",
            "src/**/*.test.ts"
        ],
        "include": [
            "src/**/*.ts",
        ],
        tsconfig...
    }

