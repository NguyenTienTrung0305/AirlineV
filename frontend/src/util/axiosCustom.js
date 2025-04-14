import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.PUBLIC_API_BASE_URL,
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

instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.dispatchEvent(new Event("storage")) // sync out
        }
        return Promise.reject(error)
    }
);

export default instance;