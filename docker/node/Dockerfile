FROM node:20-alpine AS builder

WORKDIR /var/www/html

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /var/www/html/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf