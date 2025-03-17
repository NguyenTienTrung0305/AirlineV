'use-client'
import * as React from 'react'
import { v4 as uuidv4 } from "uuid";

const defaultConfig = {
    limit: 3, // Số lượng toast hiển thị cùng lúc
    removeDelay: 5000 // Thời gian chờ trước khi xóa toast
}

function createToastSystem(config = defaultConfig) {
    const TOAST_LIMIT = config.limit
    const TOAST_REMOVE_DELAY = config.removeDelay

    const toastTimeouts = new Map() // lưu trữ các timeout xóa toast

    // Thêm một toast vào hàng đợi để tự động xóa sau một khoảng thời gian
    const addToRemoveQueue = (toastId) => {
        // Kiểm tra xem toastId đã có trong toastTimeouts chưa; nếu có, không làm gì để tránh trùng lặp
        if (toastTimeouts.has * toastId) return;

        // Tạo một setTimeout chạy sau TOAST_REMOVE_DELAY
        // Khi timeout kích hoạt, xóa toastId khỏi toastTimeouts.
        // Gửi hành động REMOVE_TOAST qua dispatch để xóa toast khỏi trạng thái
        const timeout = setTimeout(() => {
            toastTimeouts.delete(toastId)
            dispatch({ type: "REMOVE_TOAST", toastId });
        }, TOAST_REMOVE_DELAY);
        toastTimeouts.set(toastId, timeout)
    }

    // các trạng thái thay đổi qua reducer
    // nguyên tắc thiết kế (hàm thuần túy, không phụ thuộc vào yếu tố bên ngoài)
    // state: 1 object chứa thuộc tính toasts
    // toasts: mảng các toast, mỗi toast là một object riêng lẻ
    // action.toast:là một object đơn lẻ, đại diện cho toast mới cần thêm vào toasts
    // dạng của action => action = { type: "UPDATE_TOAST", toast: { id: "1", message: "Updated message", open: true } }
    const reducer = (state, action) => {
        switch (action.type) {
            case "ADD_TOAST":
                // ...state => sao chép tất cả các thuộc tính của state
                // [action.toast, ...state.toasts] => tạo mảng trong đó action.toast ở đầu tiên
                return {
                    ...state,
                    toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
                }
            case "UPDATE_TOAST":
                return {
                    ...state,
                    toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)) // { ...t, ...action.toast } => Sao chép tất cả thuộc tính của t. Ghi đè bằng các thuộc tính từ action.toast
                }
            case "DISMISS_TOAST":
                return {
                    ...state,
                    toasts: state.toasts.map((t) => t.id === action.toast.id || action.toastId === undefined ? { ...t, open: false } : t)
                }
            case "REMOVE_TOAST":
                return {
                    ...state,
                    toasts: action.toastId ? state.toasts.filter((t) => t.id !== action.toastId) : [],
                }
            default:
                return state;
        }
    }

    // lưu trữ các hàm callback (listener)
    // Các "listener" này là các hàm sẽ được gọi mỗi khi trạng thái (memoryState) thay đổi
    const listeners = []
    let memoryState = { toasts: [] }


    // gửi các hành động
    function dispatch(action) {
        // khi có DISMISS_TOAST => ẩn toast ngay lập tức, sau đó 1 thời gian mới xóa
        if (action.type === "DISMISS_TOAST") {
            const { toastId } = action
            toastId ? addToRemoveQueue(toastId) : memoryState.toasts.forEach((t) => addToRemoveQueue(t.id))
        }

        // cập nhật trạng thái toàn cục dựa trên action
        memoryState = reducer(memoryState, action)

        // gọi các listener (các component muốn nhận thông báo) khi memoryState thay đổi
        listeners.forEach((listener) => {
            listener(memoryState)
        })
    }

    // create new toast
    // flow
        // Gọi toast({ message: "Hi" }):
        // Thêm toast vào memoryState (ADD_TOAST).
        // dispatch gọi listeners.forEach → setState cập nhật state trong useToast.
        // Component re-render, hiển thị "Hi".
        // Sau duration giây, dismiss() chạy (DISMISS_TOAST) "setTimeout(dismiss, duration);"
            // memoryState cập nhật (open: false).
            // listeners.forEach gọi lại setState → Toast ẩn trên giao diện.
            // Sau TOAST_REMOVE_DELAY, addToRemoveQueue gửi "REMOVE_TOAST" → Toast bị xóa
    function toast({ duration = TOAST_REMOVE_DELAY, ...props }) {
        const id = uuidv4();
        const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
        dispatch({
            type: "ADD_TOAST",
            toast: { ...props, id, open: true, onOpenChange: (open) => !open && dismiss() },
        });
        setTimeout(dismiss, duration);
        return { id, dismiss, update: (props) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }) };
    }

    function useToast() {
        const [state, setState] = React.useState(memoryState);

        // Đăng ký component để nhận cập nhật từ hệ thống toast.
        // Dọn dẹp khi component không còn tồn tại.    
        React.useEffect(() => {
            // callback
            listeners.push(setState);

            // cleanup (useToast unmount)
            return () => {
                const index = listeners.indexOf(setState);
                if (index > -1) listeners.splice(index, 1);
            };
        }, []);
        return { ...state, toast, dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }) };
    }

    return { useToast, toast };
}

const { useToast, toast } = createToastSystem();
export { useToast, toast };
