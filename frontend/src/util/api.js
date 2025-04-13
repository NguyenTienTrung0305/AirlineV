import axios from "./axiosCustom"

// click button login trên frontend sẽ gọi làm này
const loginUserApi = (email, password) => {
    const BASE_URL_API = '/api/login' // fetch to backend localhost://3000/api/login
    const data = { email: email, password: password }
    return axios.post(URL_API, data)
}

export {
    loginUserApi
}