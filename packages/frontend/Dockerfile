# Stage 1: Build
FROM node:18.20.4-slim AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* vite.config.mts ./
RUN yarn install

COPY . .
RUN yarn run build

# Stage 2: Serve static files with nginx
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL} 