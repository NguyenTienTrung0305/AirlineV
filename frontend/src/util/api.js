import axios from "./axiosCustom"

// click button login trên frontend sẽ gọi làm này
const loginUserApi = (email, password) => {
    const BASE_URL_API = '/api/login' // fetch to backend localhost://3000/api/login
    const data = { email: email, password: password }
    return axios.post(BASE_URL_API, data)
}

const signupUserApi = (formData) => {
    const BASE_URL_API = '/api/signup' // fetch to backend localhost://3000/api/signup
    const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
    }
    return axios.post(BASE_URL_API, data)
}

export {
    loginUserApi,
    signupUserApi
}