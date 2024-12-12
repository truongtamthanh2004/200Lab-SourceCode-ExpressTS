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