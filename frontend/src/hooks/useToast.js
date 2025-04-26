'use-client'
import * as React from 'react'
import { v4 as uuidv4 } from "uuid";

const defaultConfig = {
    limit: 3, // Số lượng toast hiển thị cùng lúc
    removeDelay: 8000 // Thời gian chờ trước khi xóa toast
}


function createToastSystem(config = defaultConfig) {
    const TOAST_LIMIT = config.limit
    const TOAST_REMOVE_DELAY = config.removeDelay

    let count = 0 // id toast
    const toastTimeouts = new Map() // lưu trữ các timeout xóa toast

    function genId() {
        count = (count + 1) % Number.MAX_SAFE_INTEGER
        return count.toString()
    }

    // các trạng thái thay đổi qua reducer
    // nguyên tắc thiết kế (hàm thuần túy, không phụ thuộc vào yếu tố bên ngoài)
    // states: object chứa nhiều field, hiện tại chỉ chứa danh sách các toast, có thể mở rộng thêm
    // toasts: mảng các toast, mỗi toast là một object riêng lẻ
    // action.toast:là một object đơn lẻ, đại diện cho toast mới cần thêm vào toasts
    // dạng của action => action = { type: "UPDATE_TOAST", toast: { id: "1", message: "Updated message", open: true } }
    const reducer = (states, action) => {
        switch (action.type) {
            case "ADD_TOAST":
                // giữ nguyên các field trong states, chỉ thay đổi field toasts
                // [action.toast, ...state.toasts] => thêm phần tử mới vào vị trí đầu tiên trong toasts
                return {
                    ...states,
                    toasts: [action.toast, ...states.toasts].slice(0, TOAST_LIMIT)
                }
            case "UPDATE_TOAST":
                return {
                    ...states,
                    toasts: states.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)) // { ...t, ...action.toast } => Sao chép tất cả thuộc tính của t. Ghi đè bằng các thuộc tính từ action.toast
                }
            case 'DISMISS_TOAST':
                return {
                    ...states,
                    toasts: states.toasts.filter((t) => t.id !== action.toastId),
                };
            case "REMOVE_TOAST":
                return {
                    ...states,
                    toasts: action.toastId ? states.toasts.filter((t) => t.id !== action.toastId) : [],
                }
            default:
                return states;
        }
    }

    // lưu trữ các hàm callback (listener)
    // Các "listener" này là các hàm sẽ được gọi mỗi khi trạng thái (memoryState) thay đổi
    // memoryState = {
    //     toasts: [
    //         { id: "1", title: "Hello", description: "Welcome",... },
    //         { id: "2", title: "Warning", description: "Check your input",... },
    //     ]
    // };
    const listeners = []
    let memoryState = { toasts: [] }


    // gửi các hành động
    // Khi bạn gọi toast({ title: "Hello" })
    // → reducer thêm toast vào mảng toasts (memoryState), rồi dispatch chạy tất cả các listeners, mỗi cái là setState(memoryState), 
    // giúp component UI re-render và hiển thị toast
    function dispatch(action) {
        if (action.type === "DISMISS_TOAST") {
            const { toastId } = action;
            if (toastTimeouts.has(toastId)) {
                clearTimeout(toastTimeouts.get(toastId)); // hủy hẹn giờ, callback của setTimeout sẽ không được gọi 
                toastTimeouts.delete(toastId);
            }
        }

        // cập nhật trạng thái toàn cục dựa trên action
        memoryState = reducer(memoryState, action)

        // cập nhật giá trị của states là memoryState
        listeners.forEach((listener) => {
            listener(memoryState)
        })
    }

    // tạo một toast mới
    // dispatch là một hàm để gửi các hành động
    function toast({ ...props }) {
        const id = genId();
        const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

        // Tự động gửi dismiss để thêm toast vào hàng đợi để xóa nếu người dùng không ấn nút x
        // Tạo một setTimeout chạy sau TOAST_REMOVE_DELAY
        // Khi timeout kích hoạt, xóa toastId khỏi toastTimeouts.
        // Gửi hành động REMOVE_TOAST qua dispatch để xóa toast khỏi trạng thái
        const timeout = setTimeout(() => {
            toastTimeouts.delete(id);
            dispatch({ type: 'DISMISS_TOAST', toastId: id });
        }, TOAST_REMOVE_DELAY);
        // giả sử TOAST_REMOVE_DELAY là 10s, khi 1 toast được thêm vào hàng đợi để xóa, nó chưa xóa luôn mà 10s sau mới xóa
        // trong thời gian này, toastId sẽ được thêm vào toastTimeouts để xử lý trường hợp người dùng ấn nút x để xóa toast luôn
        // khi người dùng ấn nút x, chúng ta sẽ xóa toast và hủy setTimeOut đi để tránh toast được xóa nhiều lần, gây lỗi
        toastTimeouts.set(id, timeout);


        dispatch({
            type: "ADD_TOAST",
            toast: {
                ...props, // title, description, v.v.
                id,
                dismiss
            },
        });


        // Trả ra 1 object để có thể tự điều khiển toast này
        // dismiss => Tự đóng toast bất kỳ lúc nào
        // update => Cập nhật lại nội dung của toast (ví dụ đang "Loading..." đổi thành "Success!")
        return { id, dismiss, update: (props) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }) };
    }


    // gọi mỗi khi state thay đổi
    // thông báo cho những thằng dùng toast biết để render lại UI
    function useToast() {
        // memoryState là nơi lưu trạng thái toàn cục (mảng toast)
        // state là danh sách các toast
        // Mỗi khi memoryState thay đổi, bạn cần cập nhật lại state để component re-render.
        // Nhưng bạn không trực tiếp dùng setState trong component. Thay vào đó, bạn để hệ thống toast tự động cập nhật state thông qua cơ chế listeners
        const [state, setState] = React.useState(memoryState);

        // listeners là danh sách các hàm cần gọi mỗi khi memoryState thay đổi
        // Khi có toast mới, bạn gọi dispatch(...). Trong dispatch, bạn có dòng
        // listeners.forEach((listener) => {
        //     listener(memoryState);
        // });
        // Mà mỗi listener chính là một setState ( listeners.push(setState) )
        // => Vì vậy:  listener(memoryState) = setState(memoryState) sẽ làm component sử dụng useToast() cập nhật lại UI, theo memoryState mới
        React.useEffect(() => {
            // callback
            listeners.push(setState);

            // cleanup (useToast unmount) => loại bỏ setState khỏi listeners
            return () => {
                const index = listeners.indexOf(setState);
                if (index > -1) listeners.splice(index, 1);
            };
        }, [state]);
        return {
            ...state,
            toast,
            dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
        };
    }

    return { useToast, toast };
}

const { useToast, toast } = createToastSystem();
export { useToast, toast };
