# --- Base Stage: Build Environment ---
FROM oven/bun:1-alpine AS base
WORKDIR /monorepo

# Install pnpm and Node.js
RUN bun i -g pnpm
RUN apk add nodejs 

# Build the Database Package
COPY pnpm-workspace.yaml package.json ./
COPY packages/db/package.json packages/db/
RUN pnpm install --filter @gstore-org/db 
COPY packages/db packages/db/
RUN pnpm run db-build

# Install API Dependencies
COPY apps/api/package.json apps/api/
RUN pnpm install --filter @gstore-org/api 
COPY apps/api apps/api/
RUN pnpm --filter @gstore-org/api deploy api

# Build the API Application
WORKDIR /monorepo/api
RUN pnpm run build

# --- Runner Stage: Production Environment ---
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Install Runtime Dependencies
RUN apk add ffmpeg

# Copy Build and Dependencies
COPY --from=base /monorepo/api/dist dist/
COPY --from=base /monorepo/api/node_modules node_modules/
COPY --from=base /monorepo/api/package.json .

# Start the Application
CMD ["bun", "run", "start"]
