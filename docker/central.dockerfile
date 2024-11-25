# --- Base Stage: Build Environment ---
FROM node:20-alpine AS base
WORKDIR /monorepo

# Install pnpm 
RUN npm i -g pnpm

# Build the Database Package
COPY pnpm-workspace.yaml package.json ./
COPY packages/db/package.json packages/db/
RUN pnpm install --filter @gstore-org/db 
COPY packages/db packages/db/
RUN pnpm run db-build

# Install Central app Dependencies
COPY apps/central/package.json apps/central/
RUN pnpm install --filter @gstore-org/central
COPY apps/central apps/central/
RUN pnpm --filter @gstore-org/central deploy central

# Build the API Application
WORKDIR /monorepo/central
RUN pnpm run build

# --- Runner Stage: Production Environment ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy Build and Dependencies
COPY --from=base /monorepo/central/build build/
COPY --from=base /monorepo/central/node_modules node_modules/
COPY --from=base /monorepo/central/package.json .

CMD ["node","build"]



