FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_CHATWOOT_BASE_URL
ARG VITE_CHATWOOT_WEBSITE_TOKEN
ENV VITE_CHATWOOT_BASE_URL=${VITE_CHATWOOT_BASE_URL}
ENV VITE_CHATWOOT_WEBSITE_TOKEN=${VITE_CHATWOOT_WEBSITE_TOKEN}
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html/docs
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
