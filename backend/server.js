import express from 'express'
import session from 'express-session';
import cors from "cors"
import cookieParser from 'cookie-parser';
import config from "./src/config/dotenv.config.js"
import initWebRoutes from './src/routes/index.js'

const app = express()

app.use(cookieParser())

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
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    },
    // store 
}))


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'] // Chỉ cho phép origin của frontend

app.use(cors({
    origin: (origin, callback) => {

        console.log('DEBUG (server.js): Incoming Request Origin:', origin)

        // Kiểm tra nếu origin không có (vd: server-to-server, Postman không set Origin header)
        // HOẶC nếu origin nằm trong danh sách cho phép
        if (allowedOrigins.includes(origin) || !origin) { // Thêm !origin để cho phép các request không có origin (ví dụ: từ server-side)
            callback(null, true);
        } else {
            console.error('DEBUG (server.js): CORS Rejected - Origin mismatch. Incoming:', origin, 'Allowed:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Bắt buộc phải là true để cho phép gửi/nhận cookie
}))



app.use(express.json())

initWebRoutes(app)

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`)
})
