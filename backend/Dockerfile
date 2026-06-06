FROM node:22-alpine

# dumb-init: tiến trình PID 1 tí hon, nhận tín hiệu (SIGTERM/SIGINT) từ Docker rồi
# chuyển cho Node => container tắt sạch (graceful), không bị treo 10s khi docker stop.
RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN chown -R node:node /app
USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O- http://127.0.0.1:8080/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
