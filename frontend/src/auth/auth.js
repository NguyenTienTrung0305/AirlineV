// createContext: Tạo một Context object để chia sẻ dữ liệu (state và functions) giữa các component mà không cần truyền props qua nhiều cấp.
// useContext: Hook để truy cập giá trị từ Context trong các component con.
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { toast } from "@/hooks/useToast";
import { verifyTokenId } from "@/util/api";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebase from "./firebase";
import axios from "@/util/axiosCustom.js";
import Cookies from "js-cookie";

// Làm "kho chứa" để chia sẻ trạng thái xác thực (isAuthenticated) và các hàm liên quan (login, logout) với bất kỳ component nào trong ứng dụng
const AuthContext = createContext()


export const ROLES = {
    ADMIN: "admin",
    USER: "user"
}

const SESSION_CHECK_INTERVAL = 60 * 60 * 1000



// Bọc các component con (children) bằng AuthContext.Provider để chia sẻ dữ liệu xác thực với chúng
// AuthContext.Provider: Cung cấp isAuthenticated, login, và logout cho bất kỳ component nào nằm trong cây DOM bên dưới AuthProvider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Internal logout function (không redirect ngay)
    const logoutInternal = useCallback(async () => {
        setUser(null)
        Cookies.remove('userSession', { path: '/' })
        Cookies.remove('userCsrfToken', { path: '/' })
        Cookies.remove('adminSession', { path: '/admin' })
        Cookies.remove('adminCsrfToken', { path: '/admin' })
        Cookies.remove('connect.sid', { path: '/' })


        // Notify other tabs about logout
        // Khi người dùng đăng xuất ở một tab khác, tab đó sẽ thiết lập một item tạm thời vào localStorage ('logout'). 
        // Các tab khác sẽ phát hiện sự kiện này và tiến hành đăng xuất ở frontend (xóa trạng thái user và chuyển hướng đến trang đăng nhập)
        localStorage.setItem('logout', Date.now())
        localStorage.removeItem('logout')
    }, [])


    const checkSession = useCallback(async () => {
        try {
            const res = await axios.get("/api/auth/session")
            if (res.data.user) {
                setUser(res.data.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.log("Error checking session: ", error)
            setUser(null)

            // Nếu lỗi phiên, tự động đăng xuất ở frontend
            if (error.response?.status === 401) {
                await logoutInternal()
            }
        } finally {
            setLoading(false)
        }
    }, [logoutInternal])


    useEffect(() => {
        checkSession() // Kiểm tra phiên ban đầu khi component mount

        const intervalId = setInterval(checkSession, SESSION_CHECK_INTERVAL)

        const handleStorage = (event) => {
            if (event.key === 'logout') {
                console.log("Logout event detected from another tab")
                setUser(null)
                router.push("/login")
            }
        }

        window.addEventListener('storage', handleStorage)

        return () => {
            clearInterval(intervalId)
            window.removeEventListener('storage', handleStorage)
        }
    }, [])

    // Xử lý đăng nhập cho user
    const loginUser = async (userData) => {
        setUser({
            ...userData,
            roles: ROLES.USER,
        })
    }

    // Xử lý đăng nhập cho admin
    const loginAdmin = async (token, userData) => {
        setUser({
            ...userData,
            role: ROLES.ADMIN,
        })
    }


    // Public logout function with redirect
    const logout = async () => {
        try {
            await axios.post('/api/auth/logout') // Backend route to clear session cookies
            await logoutInternal() // để xóa trạng thái và cookie ở frontend
            await signOut(getAuth(firebase)) // Sign out from Firebase as well
            router.push("/login")
            toast({
                title: "Đăng xuất thành công",
                description: "Bạn đã đăng xuất",
                variant: "default"
            })
        } catch (error) {
            console.error("Logout error:", error)
            toast({
                title: "Lỗi đăng xuất",
                description: "Đã xảy ra lỗi khi đăng xuất",
                variant: "destructive"
            })
        }
    }
    // Kiểm tra xem người dùng có đăng nhập hay không
    const isAuthenticated = !!user;

    // Kiểm tra xem người dùng có phải là admin hay không
    const isAdmin = user?.role === ROLES.ADMIN;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                isAdmin,
                loginUser,
                loginAdmin,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);