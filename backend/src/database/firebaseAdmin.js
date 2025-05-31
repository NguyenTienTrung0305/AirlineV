// Dùng cho backend (Node.js, Express, NestJS, v.v.)
// Phải chạy trên server (nơi bạn giữ được serviceAccountKey.json)
// ✅ Dùng để làm gì?
// Quản lý người dùng: tạo user, xóa user, set custom claims, v.v.
// Xác thực token: admin.auth().verifyIdToken(token)
// Truy xuất Firestore với quyền admin (full quyền)
// ...
import admin from 'firebase-admin'

// File serviceAccountKey.json là "chìa khóa" riêng tư dành cho server của bạn để sử dụng Firebase Admin SDK. 
// Nó là một dạng Google Service Account Key dùng để xác thực backend với Firebase
// import serviceAccount from '../../serviceAccountKey.json' with { type: 'json' };

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

// singleton
// Chỉ khởi tạo nếu chưa có ứng dụng nào được tạo
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: serviceAccount.project_id,
    })
}

const db = admin.firestore()

export { admin, db }