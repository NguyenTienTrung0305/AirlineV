import dotenv from "dotenv"
import assert from "assert"

dotenv.config() // đọc file .env và nạp tất cả biến vào process.env

// Destructure các biến từ process.env
const {
    PORT,
    HOST,
    HOST_URL,
    NODE_ENV,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_API_SECRET,
} = process.env;

// Kiểm tra biến xem đã có chưa
if (NODE_ENV === 'development') {
    assert(PORT, "Port is required in development environment")
    assert(HOST, "Host is required in development environment")
}

export default {
    port: PORT,
    nodeEnv: NODE_ENV,
    host: HOST,
    hostUrl: HOST_URL,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: MEASUREMENT_ID,
    },
    cloudinaryConfig: {
        cloud_name: CLOUD_NAME,
        api_key: CLOUD_API_KEY,
        api_secret: CLOUD_API_SECRET,
    },
};