import express from 'express'
import cors from "cors"
import config from "./src/config/dotenv.config.js"
import initWebRoutes from './src/routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello từ backend!');
});

app.listen(config.port, () => {
    console.log(`Server is live @ ${config.hostUrl}`)
})

