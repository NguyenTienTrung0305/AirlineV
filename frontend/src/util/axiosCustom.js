import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.PUBLIC_API_BASE_URL
})

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        // Add authorization token to request headers
        if (localStorage.getItem('token')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (err) {
        if (err?.response?.data) return err?.response?.data;
        return Promise.reject(err);
    }
);

export default instance;