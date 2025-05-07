FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Create .env file with API URLs for production
RUN echo "NEXT_PUBLIC_USER_API_URL=http://user-service:3001/api" > .env && \
    echo "NEXT_PUBLIC_POST_API_URL=http://post-service:3002/api" >> .env && \
    echo "NEXT_PUBLIC_COMMUNITY_API_URL=http://community-service:3005/api" >> .env

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files from build stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 