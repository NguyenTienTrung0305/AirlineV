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

const verifyTokenId = (tokenId) => {
    const BASE_URL_API = '/api/verifyToken';
    return axios.get(BASE_URL_API, {
        headers: { Authorization: `Bearer ${tokenId}` }
    })
}

export {
    loginUserApi,
    loginAdminApi,
    signupUserApi,
    verifyTokenId
}