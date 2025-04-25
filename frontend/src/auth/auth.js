// createContext: Tạo một Context object để chia sẻ dữ liệu (state và functions) giữa các component mà không cần truyền props qua nhiều cấp.
// useContext: Hook để truy cập giá trị từ Context trong các component con.
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "@/hooks/useToast";
import { verifyTokenId } from "@/util/api";

// Làm "kho chứa" để chia sẻ trạng thái xác thực (isAuthenticated) và các hàm liên quan (login, logout) với bất kỳ component nào trong ứng dụng
const AuthContext = createContext()

// Bọc các component con (children) bằng AuthContext.Provider để chia sẻ dữ liệu xác thực với chúng
// AuthContext.Provider: Cung cấp isAuthenticated, login, và logout cho bất kỳ component nào nằm trong cây DOM bên dưới AuthProvider
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setIsAuthenticated(false)
            }

            try {
                const response = await verifyTokenId(token)
                if (response.status === 200) {
                    setIsAuthenticated(true)
                } else {
                    handleInvalidToken()
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                handleInvalidToken();
            }
        }

        const handleInvalidToken = () => {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
        };

        checkAuth()

        // khi đăng xuất đăng nhập từ 1 tab khác, thay đổi giá trị storage => gọi lại checkAuth
        window.addEventListener("storage", checkAuth)

        // Dọn dẹp listener khi component unmount để tránh lỗi
        return () => {
            window.removeEventListener("storage", checkAuth)
        }
    }, [])

    const login = (token) => {
        localStorage.setItem("token", token)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setIsAuthenticated(false)
        router.push({
            pathname: '/login'
        })
        toast({
            title: "Đăng xuất thành công",
            description: "Bạn đã đăng xuất",
            variant: "default",
        });
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Một custom hook để dễ dàng truy cập giá trị từ AuthContext trong bất kỳ component nào
// useContext(AuthContext): Lấy giá trị hiện tại của AuthContext (tức là { isAuthenticated, login, logout })
// Vd: const { isAuthenticated, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
