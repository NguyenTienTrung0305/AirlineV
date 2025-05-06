import loginRouters from './login/index.js'
import userRouters from './user/user.routers.js'
import adminRouters from './user/admin.routers.js'
import authRouters from './auth/index.js'

const initWebRoutes = (app) => {
    app.use("/api/auth", authRouters)
    app.use("/api/login", loginRouters)
    app.use("/api/user", userRouters)
    app.use("/api/admin", adminRouters)
    app.use("/", (req, res) => res.send("Hello World"))
    return app
}

export default initWebRoutes;