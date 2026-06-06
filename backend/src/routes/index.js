import loginRouters from "./login/index.js";
import userRouters from "./user/user.routers.js";
import adminRouters from "./user/admin.routers.js";
import authRouters from "./auth/index.js";
import createTypeSeatRouters from "./seat/index.js";
import {
  isAdminRoute,
  verifySessionAndCSRF,
} from "../middleware/auth.middleware.js";
import flightsRouters from "./flight/index.js";

import accountRouters from "./account/index.js";

import paymentRouters from "./payment/index.js";

const initWebRoutes = (app) => {
  app.get("/health", (req, res) =>
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }),
  );

  app.use("/admin/auth", authRouters);
  app.use("/api/login", loginRouters);
  app.use("/api/user", userRouters);
  app.use("/api/admin", adminRouters);

  app.use("/api/account", accountRouters);

  app.use(
    "/api/typeSeats",
    verifySessionAndCSRF,
    isAdminRoute,
    createTypeSeatRouters,
  );
  app.use(
    "/api/admin/flights",
    verifySessionAndCSRF,
    isAdminRoute,
    flightsRouters,
  );

  app.use("/api/flights", flightsRouters);

  app.use("/api/payment", paymentRouters);

  app.use("/", (req, res) => res.send("Hello World"));
  return app;
};

export default initWebRoutes;
