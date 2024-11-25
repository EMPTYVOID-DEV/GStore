FROM node:20-alpine 
WORKDIR /monorepo

# Install pnpm 
RUN npm i -g pnpm

# Build the Database Package
COPY pnpm-workspace.yaml package.json ./
COPY packages/db/package.json packages/db/
RUN pnpm install --filter @gstore-org/db 
COPY packages/db packages/db/
RUN pnpm run db-build

WORKDIR /monorepo/packages/db
CMD [ "pnpm","run","migration-script" ]