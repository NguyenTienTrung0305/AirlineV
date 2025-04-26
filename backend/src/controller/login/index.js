import { admin } from "../../database/firebaseAdmin.js"

import { dbCreateUser, dbGetUserById } from "../../services/users/User.service.js"

// khi người dùng nhập email và password, firebase SDK sẽ xác thực và trả về idToken, sau đó gửi idToken này cho firebase-admin ở backend dể xác thực
export const userLogin = async (req, res) => {
    const { idToken } = req.body

    try {
        const decodeToken = await admin.auth().verifyIdToken(idToken)
        const userId = decodeToken.uid

        const user = await dbGetUserById(userId)

        res.status(200).json({
            user: user,
            token: idToken,
            message: "Login Success"
        })
    } catch (err) {
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

}

// Khi người dùng nhấn vào icon Google:
// Trình duyệt sẽ mở một popup Google Sign-In (hoặc chuyển hướng trang, tùy bạn dùng signInWithPopup hay signInWithRedirect)
// Người dùng chọn tài khoản Google
// Sau khi thành công, Firebase frontend SDK sẽ trả về thông tin user + idToken
// Bạn gửi idToken về backend để xác minh
export const googleLogin = async (req, res) => {
    const { idToken } = req.body
    try {
        const decodeToken = await admin.auth().verifyIdToken(idToken)
        const uid = decodeToken.uid

        const userData = await dbGetUserById(uid);
        res.status(200).json({
            user: userData,
            token: idToken,
            message: "Google login success",
        })
    }

    catch (error) {
        console.error("Google login failed:", error);
        res.status(401).json({ message: "Google login failed" });
    }
}



export const adminLogin = async (req, res) => {
    const { idToken } = req.body;
    try {
        const decoded = await admin.auth().verifyIdToken(idToken);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền truy cập với vai trò admin" });
        }

        const adminData = await dbGetAdminById(decoded.uid);

        res.status(200).json({
            user: adminData,
            token: idToken,
            message: "Admin login success"
        });
    } catch (error) {
        console.error("Admin login failed:", error);
        res.status(401).json({ message: "Token không hợp lệ hoặc bạn không phải admin" });
    }
}




// // frontend web sdk
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

// const auth = getAuth();
// const provider = new GoogleAuthProvider();

// signInWithPopup(auth, provider)
//   .then(async (result) => {
//     const idToken = await result.user.getIdToken();

//     // Gửi token về server để xử lý đăng nhập
//     const res = await fetch("http://localhost:3000/api/auth/google", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ idToken }),
//     });

//     const data = await res.json();
//     console.log("Login success!", data);
//   })
//   .catch((err) => {
//     console.error("Login failed", err);
//   });