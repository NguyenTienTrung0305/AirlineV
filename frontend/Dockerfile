# STAGE 1: Build
FROM node:22-alpine AS builder
WORKDIR /app


COPY package*.json ./
RUN npm ci

# Biến NEXT_PUBLIC_* của Next.js được nhúng vào bundle tại thời điểm build, không phải lúc container chạy.
# Vì vậy cần truyền qua ARG từ docker build / docker compose build.args, rồi gán thành ENV trước khi chạy "next build".
# Khi đó giá trị mới được đóng vào file JS gửi cho trình duyệt.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_AUTH_DOMAIN
ARG NEXT_PUBLIC_PROJECT_ID
ARG NEXT_PUBLIC_STORAGE_BUCKET
ARG NEXT_PUBLIC_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_APP_ID
ARG NEXT_PUBLIC_MEASUREMENT_ID
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY \
    NEXT_PUBLIC_AUTH_DOMAIN=$NEXT_PUBLIC_AUTH_DOMAIN \
    NEXT_PUBLIC_PROJECT_ID=$NEXT_PUBLIC_PROJECT_ID \
    NEXT_PUBLIC_STORAGE_BUCKET=$NEXT_PUBLIC_STORAGE_BUCKET \
    NEXT_PUBLIC_MESSAGING_SENDER_ID=$NEXT_PUBLIC_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_APP_ID=$NEXT_PUBLIC_APP_ID \
    NEXT_PUBLIC_MEASUREMENT_ID=$NEXT_PUBLIC_MEASUREMENT_ID

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# STAGE 2: RUN => Image cuối chỉ chứa Node runtime + output standalone
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# output: 'standalone' => khi build, Next.js sẽ tạo ra một bản build gọn trong thư mục standalone, chứa server.js + node_modules cần thiết để chạy production
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

# Standalone server đọc PORT & HOSTNAME từ env. 0.0.0.0 để nhận kết nối từ ngoài container.
ENV PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
