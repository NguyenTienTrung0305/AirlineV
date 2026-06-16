# STAGE 1: Build
FROM node:22-alpine AS builder
WORKDIR /app


COPY package*.json ./
RUN npm ci

# Biến NEXT_PUBLIC_* phải được nhúng vào bundle lúc BUILD, không phải lúc container chạy.
#  + Vì code này chạy trên TRÌNH DUYỆT (không có process.env như Node). Lúc build, Next.js
#    THAY THẲNG process.env.NEXT_PUBLIC_* bằng giá trị chuỗi cố định, in cứng vào file JS.
#  + Nên lúc run không đổi được nữa (file JS đã đông cứng) => phải có giá trị từ lúc build.
# Dùng ARG để NHẬN build-args (giá trị compose hoặc CI/CD gửi vào qua build-args), rồi ENV để next build (Node) đọc được
# qua process.env và in vào bundle.
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

# Standalone không tự gồm thư mục public và .next/static => phải copy tay cả 2,
# nếu không sẽ thiếu ảnh tĩnh (bg-*.jpg) và ảnh tối ưu qua /_next/image (lỗi 400/404).
COPY --from=builder --chown=node:node /app/public ./public

# output: 'standalone' => Next.js tạo bản build gọn (server.js + node_modules cần thiết).
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

# Standalone server đọc PORT & HOSTNAME từ env. 0.0.0.0 để nhận kết nối từ ngoài container.
ENV PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
