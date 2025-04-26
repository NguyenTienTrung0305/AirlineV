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


    const silentlyVerifyToken = async (token) => {
        try {
            const response = await verifyTokenId(token)
            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log("Verification attempt failed silently:", error.message);
            return false;
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token")
            console.log(token)
            if (!token) {
                setIsAuthenticated(false)
                return;
            }

            const isValid = await silentlyVerifyToken(token)
            setIsAuthenticated(isValid);
        }

        // chỉ được gọi 1 lần duy nhất khi người dùng mở trang web (trừ khi họ reload lại, chuyển tab mới, hoặc logout và login lại)
        checkAuth()

        // Chỉ lắng nghe sự kiện localStorage.removeItem("token") - khi đăng xuất thực sự
        const handleStorageChange = (e) => {
            if (e.key === "token" && e.newValue === null) {
                setIsAuthenticated(false)
            }
            // Nếu token được thêm mới từ tab khác, đánh dấu đã đăng nhập
            else if (e.key === "token" && e.newValue) {
                setIsAuthenticated(true)
            }
        }

        window.addEventListener("storage", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
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
