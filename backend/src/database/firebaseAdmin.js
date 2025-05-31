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
import path from 'path';
import { fileURLToPath } from 'url'
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount

if (process.env.NODE_ENV === 'development') {
    try {
        const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json')
        const fileContent = fs.readFileSync(serviceAccountPath, 'utf8')
        serviceAccount = JSON.parse(fileContent)
    } catch (error) {
        console.error('Lỗi: Không tìm thấy serviceAccountKey.json hoặc lỗi đọc/phân tích cú pháp trong môi trường phát triển cục bộ:', error)
        process.exit(1)
    }
} else {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

    if (!serviceAccountJson) {
        process.exit(1);
    }

    try {
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log('Firebase Admin SDK đã được khởi tạo từ biến môi trường (production).')
    } catch (error) {
        console.error('Lỗi phân tích cú pháp JSON từ biến môi trường:', error);
        process.exit(1);
    }
}

const app = !getApps().length ? initializeApp({
    credential: cert(serviceAccount)
}) : getApp(); 

export const admin = app
export const db = getFirestore(app)