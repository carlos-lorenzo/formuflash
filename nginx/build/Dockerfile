# Prod build

# Stage 1: Build the frontend
FROM node:alpine AS frontend-builder
WORKDIR /app
COPY /frontend/package*.json ./
RUN npm ci
COPY /frontend/ .
RUN npm run build


# Stage 2: Build the Nginx container
FROM nginx:1.27.0-alpine
COPY --from=frontend-builder /app/dist /var/www/frontend
COPY /nginx/build/default.conf /etc/nginx/conf.d/default.conf
COPY /backend/static/ /app/static/