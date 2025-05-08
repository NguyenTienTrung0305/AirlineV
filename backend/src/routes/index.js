import loginRouters from './login/index.js'
import userRouters from './user/user.routers.js'
import adminRouters from './user/admin.routers.js'
import authRouters from './auth/index.js'
import createTypeSeatRouters from './seat/index.js'
import { isAdminRoute, verifySessionAndCSRF } from '../middleware/auth.middleware.js'

const initWebRoutes = (app) => {
    app.use("/api/auth", authRouters)
    app.use("/api/login", loginRouters)
    app.use("/api/user", userRouters)
    app.use("/api/admin", adminRouters)
    app.use("/api/typeSeats", verifySessionAndCSRF, isAdminRoute, createTypeSeatRouters)
    app.use("/", (req, res) => res.send("Hello World"))
    return app
}

export default initWebRoutes;