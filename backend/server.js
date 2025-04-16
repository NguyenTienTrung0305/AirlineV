import express from 'express'
import cors from "cors"
import config from "./src/config/dotenv.config.js"
import initWebRoutes from './src/routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())

initWebRoutes(app)

app.listen(config.port || 8080 , () => {
    console.log(`Server is live @ http://${config.host}:${config.port}`)
})

