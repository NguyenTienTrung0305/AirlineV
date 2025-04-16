import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    ,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        // Add authorization token to request headers
        if (localStorage.getItem('token')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }

        //get roleadmin 
        const isAdmin = localStorage.getItem('admin') === 'true'
        config.headers.admin = isAdmin ? 'true' : 'false'
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// response sẽ là 1 object có cấu trúc như sau:
// {
//     data: {...},         // ✅ Dữ liệu trả về từ server (chính là `res.send(...)`)
//     status: 200,         // Mã HTTP (200, 400, 500...)
//     statusText: "OK",    // Chuỗi mô tả status (thường là "OK")
//     headers: {...},      // Các header từ response (ví dụ Content-Type)
//     config: {...},       // Cấu hình của request (method, URL, headers gửi đi, v.v.)
//     request: {}          // XMLHttpRequest hoặc Request object gốc
// }
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.dispatchEvent(new Event("storage")) // sync out
        }
        return Promise.reject(error)
    }
);

export default instance;