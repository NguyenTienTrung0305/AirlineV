// Dùng cho backend (Node.js, Express, NestJS, v.v.)
// Phải chạy trên server (nơi bạn giữ được serviceAccountKey.json)
// ✅ Dùng để làm gì?
// Quản lý người dùng: tạo user, xóa user, set custom claims, v.v.
// Xác thực token: admin.auth().verifyIdToken(token)
// Truy xuất Firestore với quyền admin (full quyền)
// ...
// import admin from 'firebase-admin'

// // File serviceAccountKey.json là "chìa khóa" riêng tư dành cho server của bạn để sử dụng Firebase Admin SDK. 
// // Nó là một dạng Google Service Account Key dùng để xác thực backend với Firebase
// import serviceAccount from '../../serviceAccountKey.json' with { type: 'json' };

// // const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

// // singleton
// // Chỉ khởi tạo nếu chưa có ứng dụng nào được tạo
// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//         databaseURL: serviceAccount.project_id,
//     })
// }

// const db = admin.firestore()

// export { admin, db }



import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import path from 'path';
import { fileURLToPath } from 'url'
import fs from 'fs';
import { json } from 'stream/consumers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount

// docker local
if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    try {
        const file = fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
        serviceAccount = JSON.parse(file)
    } catch (error) {
        process.exit(1)
    }
}

// deploy, read serviceAccountJson from enviroment variable of render.com
else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    } catch (error) {
        process.exit(1)
    }

// local development
} else {
    try {
        const fallbackPath = path.join(__dirname, '../../serviceAccountKey.json')
        const file = fs.readFileSync(fallbackPath, 'utf8')
        serviceAccount = JSON.parse(file)
    } catch (error) {
        process.exit(1)
    }
}


const app = !getApps().length ? initializeApp({
    credential: cert(serviceAccount)
}) : getApp()

export const db = getFirestore(app)
export const auth = getAuth(app)