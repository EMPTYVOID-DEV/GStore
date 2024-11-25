# GStore API

This README explains how the GStore API works.

## Tech Stack

The GStore API is built using the following tools:

1. **Hono** (on top of the Bun runtime)
2. **TypeScript**
3. **Drizzle ORM**
4. **Zod** for validation
5. **Sharp** for image transformations
6. **pdf-lib** for PDF transformations
7. **fluent-ffmpeg** for video transformations

## Folder Structure

```
📂 api
└── 📂 src
    ├── 📂 middlewares
    ├── 📂 routes
    │   ├── 📂 files
    │   ├── 📂 imgTransformations
    │   ├── 📂 pdfTransformations
    │   ├── 📂 store
    │   └── 📂 vidTransformations
    ├── 📂 shared
    ├── 📂 utils
    └── 📄 index.ts
```

1. `index.ts` is the API entry point.
2. The **shared** folder includes global types, constants, and Zod schemas.
3. The **utils** folder contains utility functions for Hono, Zod, the database, and general use.
4. The **middlewares** folder includes the rate limiter, global Zod hooks, and the authorization middleware.
5. Each set of routes has its own folder. Within each route folder, you'll find the following files:
   1. **`.dal.ts`**: Contains the route definitions.
   2. **`.schema.ts`**: Contains the schemas used by the routes.
   3. **`.handler.ts`**: Contains the route handlers.
   4. **`index.ts`**: Exports the OpenAPI router for the routes.

## Routes

The **files**, **images**, **PDFs**, and **video** routes are public. Simply include your API key in the `Authorization` header as a Bearer token in your requests.

However, the **store** routes are internal and are only accessible to the central app.

For more details on the available routes, refer to the API documentation.

## Logging

Currently, the API uses a basic logging method that writes server errors and request traces to a `.log` file. Any unexpected errors are caught globally.

## Validation

The environment variables are validated using a zod schema.

## Standards

We tried to design the GStore API to follow web standards as much as possible since that what bun and hono follows, but there are some libraries built for Node.js that require us to use Node-based APIs at times. You will find a lot of helpers to transform from one standard to another.

## Usage

To run the API independently, follow these steps:

1. Copy the `.env.example` file to `.env` and configure it as needed.
2. Run the following command to start the API using Docker:
   ```bash
   sudo docker run -d --name gstore_api -p 3000:3000 -v gstore_storage:/app/storage
   ```
