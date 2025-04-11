import { initializeApp } from "firebase/app";
import config from "../config/dotenv.config.js"

const firebase = initializeApp(config.firebaseConfig)

export default firebase