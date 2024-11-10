# GStore Central app

The role of this app to store management: user authentication , creating and deleting stores , creating and deleting api keys.

## Tech Stack

This is the tech stack of the central app :

1. **Sveltekit**: using adapter node.
2. **Typescript**
3. **Zero-ui**: a minimal svelte ui library.
4. **Drizzle Orm**.
5. **Lucia**: The auth logic is pulled from lucia.

## Folder structure

```
📂 src
├── 📂 lib
│   ├── 📂 assets
│   │   ├── 📂 fonts
│   │   └── 📂 images
│   ├── 📂 client
│   │   ├── 📂 components
│   │   ├── 📂 icons
│   │   ├── 📄 types.d.ts
│   │   └── 📄 utils.client.ts
│   ├── 📂 global
│   │   ├── 📄 zod.ts
│   │   └── 📄 types.global.ts
│   └── 📂 server
│       ├── 📂 database
│       ├── 📂 utils
│       ├── 📄 const.server.ts
│       └── 📄 types.server.ts
├── 📂 routes
├── 📄 app.css
├── 📄 app.ts
└── 📄 app.html
```

### Notes

1. The smtp auth method is **login** you can change it to oauth2 in lib/server/utils/email.ts.
2. The app uses global colors and fonts in app.css.
3. The app will ping the api in order to create or delete a store.
4. Stores have a unique name per user.
5. Api keys have a unique name per store.
