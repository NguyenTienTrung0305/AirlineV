import loginRouters from './login/index.js'
import userRouters from './user/user.routers.js'

const initWebRoutes = (app) => {
    app.use("/api/login", loginRouters)
    app.use("/api/user", userRouters)
    app.use("/", (req, res) =>  res.send("Hello World"))
    return app
}

export default initWebRoutes;