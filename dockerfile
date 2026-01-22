# =========================
# 1) Builder
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack để dùng pnpm
RUN corepack enable

# Copy lock & manifest trước để cache tốt
COPY package.json pnpm-lock.yaml ./

# Cài deps (cần devDeps để build)
RUN pnpm install --frozen-lockfile

# Copy toàn bộ source
COPY . .

# Build NestJS → dist/
RUN pnpm run build

# Remove dev deps, chỉ giữ prod deps
RUN pnpm prune --prod


# =========================
# 2) Runner (non-root)
# =========================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Tạo user riêng để chạy app
RUN addgroup -S app && adduser -S app -G app

# Copy đúng những gì cần để chạy
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Set quyền sở hữu
RUN chown -R app:app /app

USER app

EXPOSE 3000

CMD ["node", "dist/main.js"]
