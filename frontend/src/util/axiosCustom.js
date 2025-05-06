import axios from 'axios'
import { getAuth } from 'firebase/auth';
import Cookies from 'js-cookie';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    ,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Đảm bảo cookie được gửi
})

// Thêm header CSRF token cho các request thay đổi trạng thái
instance.interceptors.request.use(
    async (config) => {
        try {
            // Only add CSRF token for state-changing requests
            if (['post', 'put', 'delete', 'patch'].includes(config.method.toLocaleLowerCase())) {
                let csrfToken = null

                // Kiểm tra path để xác định cookie CSRF token
                if (config.url.startsWith('/api/admin')) {
                    csrfToken = Cookies.get('adminCsrfToken')
                } else {
                    csrfToken = Cookies.get('userCsrfToken')
                }

                if (csrfToken) {
                    config.headers['x-csrf-token'] = csrfToken
                }
            }

            return config
        } catch (error) {
            console.error("Request interceptor error:", error)
            return config
        }
    },

    (error) => {
        return Promise.reject(error)
    }
)

// response sẽ là 1 object có cấu trúc như sau:
// {
//     data: {...},         // ✅ Dữ liệu trả về từ server (chính là `res.send(...)`)
//     status: 200,         // Mã HTTP (200, 400, 500...)
//     statusText: "OK",    // Chuỗi mô tả status (thường là "OK")
//     headers: {...},      // Các header từ response (ví dụ Content-Type)
//     config: {...},       // Cấu hình của request (method, URL, headers gửi đi, v.v.)
//     request: {}          // XMLHttpRequest hoặc Request object gốc
// }
// Handle response, session refresh, and redirects
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Nếu lỗi là session không hợp lệ (có thể do cookie session hết hạn)
        if (error.response?.status === 401 &&
            error.response?.data.code === 'INVALID_SESSION'
        ) {
            // Chuyển hướng đến trang đăng nhập
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login'
            }
            return Promise.reject(error) // Không thử lại request
        }

        // Nếu lỗi là CSRF token không hợp lệ
        if (error.response?.status === 403 &&
            (error.response?.data?.code === 'CSRF_INVALID' || error.response?.data?.code === 'CSRF_MISSING')
        ) {

            toast({
                title: "Lỗi bảo mật",
                description: "CSRF token không hợp lệ. Vui lòng thử lại.",
                variant: "destructive",
            });
            // Có thể thử tải lại trang hoặc đăng xuất người dùng
            // window.location.reload()
            return Promise.reject(error)
        }



        if (error.response?.status === 403 &&
            error.response?.data?.code === 'UNAUTHORIZED_ADMIN'
        ) {
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/api/login/admin'
            }
        }

        return Promise.reject(error)
    }
)

export default instance;