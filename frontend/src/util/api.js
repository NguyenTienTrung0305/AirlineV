import axios from "./axiosCustom"

// click button login trên frontend sẽ gọi làm này
const loginUserApi = async (idToken) => {
    const response = await axios.post('/api/login/user', { idToken })  // fetch to backend localhost://8080/api/login/user
    return response;
}

const loginAdminApi = async (idToken) => {
    const response = await axios.post('/api/login/admin', { idToken })
    return response;
}

const loginGoogleApi = async (idToken) => {
    const response = await axios.post('/api/login/google', { idToken })  
    return response;
}

const signupUserApi = (formData) => {
    const BASE_URL_API = '/api/user/new' // fetch to backend localhost://8080/api/signup
    const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
    }
    return axios.post(BASE_URL_API, data)
}


const createNewFlightApi = async (formData) => {
    const response = await axios.post('/api/admin/flights/new', formData)
    return response
}

export {
    loginUserApi,
    loginAdminApi,
    loginGoogleApi,
    signupUserApi,
    createNewFlightApi
}