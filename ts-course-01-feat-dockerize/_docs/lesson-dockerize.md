# Dockerize service
## 1. Update `tsconfig.json`
In order to build the project with TypeScript, we need to update `tsconfig.json` to set the correct options.
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ESNext",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./src",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@modules/*": ["modules/*"],
      "@share/*": ["share/*"]
    }
  }
}
```

## 2. Install `tsc-alias`
`tsc-alias` is a tool that allows us to use aliases in our TypeScript code. Because we use `@modules` and `@share` in our code, we need to install `tsc-alias` to build the project.

```bash
npm install -D tsc-alias
```

## 3. Test build run the project
First update `package.json` to add `build` script.
```json
"build": "tsc && tsc-alias"
```

Then test build and run the project.

```bash
npm run build
node dist/index.js
```

## 4. Dockerize the project
### 1. Update `prisma/schema.prisma`:
Set the correct binary targets for the Docker image.
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
}
```

### 2. Create `.dockerignore`
Create a `.dockerignore` file to exclude unnecessary files from the Docker image.
```
node_modules
dist
.env
.dockerignore
Dockerfile
```

### 3. Create `Dockerfile`
Create a `Dockerfile` to build the project.

```dockerfile
FROM node:22 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

# Copy the rest of the application code
COPY --chown=node:node . .

# Generate Prisma client
RUN npx prisma generate

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV=production

RUN npm ci --omit=dev && npm cache clean --force

# Regenerate Prisma client, as the prisma client is cleared when running `npm ci`
RUN npx prisma generate

USER node

###################
FROM node:22-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

COPY .env.* ./

COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json

WORKDIR /dist

EXPOSE 3000
CMD [ "node", "index.js" ]
```

### 4. Build the image
```bash
docker build -t nj02:1.0.0 .
```

### 5. Run the container
Please make sure the `mysql` container is running with the correct database, username, and password.

```bash
docker network create deploy-net
docker network connect deploy-net mysql

docker run -d -p 3000:3000 \
  -e DATABASE_URL="mysql://root:ead8686ba57479778a76e@mysql:3306/demo" \
  -e DB_NAME=demo \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=ead8686ba57479778a76e \
  -e DB_HOST=mysql \
  -e DB_PORT=3306 \
  --network deploy-net  \
  --name ts-service-01 nj02:1.0.0
```

