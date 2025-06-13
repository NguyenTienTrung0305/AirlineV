import express from 'express'
import session from 'express-session';
import cors from "cors"
import cookieParser from 'cookie-parser';
import config from "./src/config/dotenv.config.js"
import initWebRoutes from './src/routes/index.js'

const app = express()

let allowedOrigins
if (process.env.NODE_ENV === 'development') {
    allowedOrigins = ['http://localhost:3000']
} else {
    allowedOrigins = ['https://airline-v.vercel.app']
}

app.use(cors({
    origin: (origin, callback) => {

        console.log('DEBUG (server.js): Incoming Request Origin:', origin)
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.error('DEBUG (server.js): CORS Rejected - Origin mismatch. Incoming:', origin, 'Allowed:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Bắt buộc phải là true để cho phép gửi/nhận cookie
}))

app.use(cookieParser())
app.use(express.json())

// Quản lý phiên người dùng ở phía server. Nó cung cấp các cơ chế để tạo, lưu trữ và truy xuất dữ liệu phiên liên quan đến từng người dùng
// Khi một người dùng mới truy cập ứng dụng (hoặc phiên của họ hết hạn), express-session sẽ tạo một Session ID duy nhất cho họ dựa trên secret và bộ mã hóa
// Nên kết nối với redis hoặc database trong môi trường production
// Khác với Session Cookie (Cookie ở Frontend)
// + Đây là một cookie HTTP được gửi từ server về trình duyệt (frontend) của người dùng
// + Trong các request tiếp theo từ trình duyệt đó đến server, cookie này sẽ được tự động gửi đi trong header Cookie. 
// Server (thông qua express-session middleware) sẽ sử dụng Session ID được gửi trong cookie được cấu hình trong express-session để xác định phiên của người dùng và truy 
// cập dữ liệu phiên đã được lưu trữ ở backend (req.sesison.user, req.sesison.role,...)
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false, // Đổi thành false để không tạo session rỗng
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Chỉ true khi production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax', // Development dùng 'lax'
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    },
    name: 'connect.sid', 
    // store: // Nên dùng Redis hoặc database store trong production
}))



initWebRoutes(app)

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`)
})
