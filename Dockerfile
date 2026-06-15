# Stage 1: Build
FROM node:20 AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY . .

# Build all 4 templates
RUN cd calm-warm && pnpm install && pnpm run build
RUN cd modern-light && pnpm install && pnpm run build
RUN cd clean-medical && pnpm install && pnpm run build
RUN cd friendly-care && pnpm install && pnpm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy hasil build ke masing-masing folder
COPY --from=builder /app/calm-warm/dist /usr/share/nginx/html/calmwarm
COPY --from=builder /app/modern-light/dist /usr/share/nginx/html/modernlight
COPY --from=builder /app/clean-medical/dist /usr/share/nginx/html/cleanmedical
COPY --from=builder /app/friendly-care/dist /usr/share/nginx/html/friendlycare

# Copy custom config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
