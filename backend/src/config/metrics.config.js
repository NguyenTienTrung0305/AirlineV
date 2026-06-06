import client from "prom-client";

export const register = new client.Registry();

register.setDefaultLabels({ app: "airline-backend" });

// Tự động thu thập metric hệ thống của Node: CPU, RAM, event-loop lag, GC, số file mở...
client.collectDefaultMetrics({ register });

// Histogram: đô phân bố của một giá trị (ở đây: thời gian xử lý request, đơn vị giây)
// buckets là các mốc thời gian để Prometheus đếm "bao nhiêu request nhanh hơn mốc này"
// => từ đó tính được p50/p95/p99 (độ trễ phần trăm) trên Grafana.
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Thoi gian xu ly HTTP request (giay)",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

// Middleware đo thời gian mỗi request: bấm giờ lúc vào, chốt giờ khi response 'finish'.
export const metricsMiddleware = (req, res, next) => {
  // Bỏ qua chính /metrics để Prometheus scrape không tự làm phình số liệu của nó.
  if (req.path === "/metrics") return next();

  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const route = req.route?.path || req.baseUrl || "unmatched";
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
};
