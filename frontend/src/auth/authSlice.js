// // Nếu sử dụng redux thay vì createContext
// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         isAuthenticated: false
//     },
//     reducers: {
//         login: (state, action) => {
//             localStorage.setItem("token", action.payload); // Lưu token
//             state.isAuthenticated = true;
//         },
//         logout: (state) => {
//             localStorage.removeItem("token"); // Xóa token
//             state.isAuthenticated = false;
//         },
//         checkAuth: (state) => {
//             const token = localStorage.getItem("token");
//             state.isAuthenticated = !!token; // Đồng bộ từ localStorage
//         },
//     },
// })

// export const {login, logout, checkAuth} = authSlice.actions
// export default authSlice.reducer

// // store.js
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";

// export const store = configureStore({
//     reducer: {
//         auth: authReducer,
//     },
// });



// // _app.js (Next.js)
// import { Provider } from "react-redux";
// import { store } from "../store";

// function MyApp({ Component, pageProps }) {
//     return (
//         <Provider store={store}>
//             <Component {...pageProps} />
//         </Provider>
//     );
// }

// export default MyApp;

// // Component sử dụng (ví dụ: AuthComponent.js)
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { login, logout, checkAuth } from "../store/authSlice";

// const AuthComponent = () => {
//     // Dùng useSelector để lấy state, useDispatch để gửi action.
//     const dispatch = useDispatch();
//     const { isAuthenticated } = useSelector((state) => state.auth);
//     const router = useRouter();

//     useEffect(() => {
//         dispatch(checkAuth()); // Kiểm tra trạng thái khi mount
//         const handleStorageChange = () => dispatch(checkAuth());
//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, [dispatch]);

//     const handleLogin = (token) => {
//         dispatch(login(token)); // Gọi action login
//     };

//     const handleLogout = () => {
//         dispatch(logout()); // Gọi action logout
//         router.push("/login");
//     };

//     return (
//         <div>
//             {isAuthenticated ? (
//                 <button onClick={handleLogout}>Logout</button>
//             ) : (
//                 <button onClick={handleLogin}>Login</button>
//             )}
//         </div>
//     );
// };

// export default AuthComponent;