import axios from "@/util/axiosCustom.js";
import { useEffect, useCallback, useState, useRef } from 'react'

export function formatTime(date) {
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })
}

export function formatFlightDuration(arrivalTime, departureTime) {
    if (!(arrivalTime instanceof Date) || !(departureTime instanceof Date) || isNaN(arrivalTime) || isNaN(departureTime)) {
        return "Không xác định"
    }

    const durations = arrivalTime.getTime() - departureTime.getTime() // miliseconds

    if (durations < 0) {
        return "Thời gian bay không hợp lệ"
    }

    const hours = Math.floor(durations / (60 * 60 * 1000))
    const minutes = Math.floor((durations % (60 * 60 * 1000)) / (60 * 1000))

    return `${hours}h${minutes.toString().padStart(2, '0')}m` // Thêm số 0 vào đầu của minutes đảm bảo độ dài minutes là 2 (ví dụ 5 => 05)
}

export function formatDate(date) {
    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

/** 
 * Chuyển dữ liệu API sang định dạng cần thiết 
 * Tách ra ngoài để không bị re-create mỗi lần render 
 */
/**
 {
  "message": "Flights suggesion successfully",
  "code": "FLIGHT_SUGGESION_SUCCESS",
  "data": [
    "flights": [
        "flight": {
            "flightId": string, // e.g., "HANVN123-250508"
            "flightCode": string, // e.g., "VN123"
            "aircraftType": string, // e.g., "Boeing 787"
            "departureCode": string, // e.g., "HAN"
            "arrivalCode": string, // e.g., "SGN"
            "departureTime": string, // ISO string, e.g., "2025-05-08T10:15:00.000Z"
            "arrivalTime": string, // ISO string, e.g., "2025-05-08T12:15:00.000Z"
            "departureCity": string, // e.g., "Hà Nội"
            "arrivalCity": string, // e.g., "Hồ Chí Minh"
            "status": string // e.g., "OnTime"
        },
        "rows": number, // e.g., 13
        "cols": number, // e.g., 6
        "seatType": string[], // e.g., ["Business", "Economy"]
        "startRowBus": number, // e.g., 1
        "startRowEco": number, // e.g., 5
        "standardPrice": number, // e.g., 1500000
        "seats": [
            {
            "flightId": string, // e.g., "HANVN123-250508"
            "seatCode": string, // e.g., "A1"
            "row": number, // e.g., 1
            "col": string, // e.g., "A"
            "typeCode": string, // e.g., "Business" or "Economy"
            "standardPrice": number, // e.g., 1500000
            "isAvailable": boolean, // e.g., true
            "isLocked": boolean, // e.g., false
            "lockedBy": null | string, // e.g., null
            "lockExpiresAt": null | string, // ISO string if locked
            "lockedAt": null | string, // ISO string if locked
            "soldTo": null | string, // e.g., null
            "soldAt": null | string // ISO string if sold
            },
            // ... more seat objects
        ]
    ],
    "seatTypes": [
        {
            "typeCode": "Business",
            "seatName": "Thương gia cổ điển",
            "price": 1500000,
            "changeFee": 200000,
            "refundFee": 500000,
            "checkedBaggage": 30,
            "carryOn": 10,
            "service": ["Ưu tiên check-in", "Đồ uống miễn phí"]
        },
        {
            "typeCode": "Economy",
            "seatName": "Phổ thông",
            "price": 500000,
            "changeFee": 100000,
            "refundFee": 200000,
            "checkedBaggage": 20,
            "carryOn": 7,
            "service": ["Bữa ăn nhẹ"]
        }
    ]
  ]
}
 */
function transformFlight(data, from, to) {
    return data.flights.map((item) => {
        const flight = item.flight

        const departureTimeObj = new Date(flight.departureTime)
        const arrivalTimeObj = new Date(flight.arrivalTime)

        // Tạo economyOptions và businessOptions từ seatTypes
        const economyOptions = data.seatTypes
            .filter((seatType) => seatType.typeCode.startsWith("E"))
            .map((seatType) => ({
                id: seatType.typeCode,
                name: seatType.seatName,
                price: seatType.price,
                changeFee: seatType.changeFee,
                refundFee: seatType.refundFee,
                checkedBaggage: seatType.checkedBaggage,
                carryOn: seatType.carryOn,
                service: seatType.service,
            }))

        const businessOptions = data.seatTypes
            .filter((seatType) => seatType.typeCode.startsWith("B"))
            .map((seatType) => ({
                id: seatType.typeCode,
                name: seatType.seatName,
                price: seatType.price,
                changeFee: seatType.changeFee,
                refundFee: seatType.refundFee,
                checkedBaggage: seatType.checkedBaggage,
                carryOn: seatType.carryOn,
                service: seatType.service,
            }))

        // Tạo seatCol từ seats
        const seatCol = [];
        const cols = Array.from({ length: item.cols }, (_, i) => String.fromCharCode(65 + i)); // Tạo mảng cột: ['A', 'B', ..., 'F']
        const specificSoldoutSeats = item.seats.filter((seat) => !seat.isAvailable || seat.soldTo)

        cols.forEach((col) => {
            // số lượng ghế thuộc loại "Business" trong cột hiện tại
            const businessSeats = item.seats.filter(
                (seat) => seat.col === col && seat.typeCode === "Business"
            ).length
            const normalSeats = item.seats.filter(
                (seat) => seat.col === col && seat.typeCode === "Economy"
            ).length

            seatCol.push({
                col,
                rowBusiness: businessSeats, // số lượng hàng ghế thương gia
                rowNormal: normalSeats, // số lượng hàng ghế phổ thông
                missBusiness: 0, 
                missNormal: 0,
            })
        })

        // Thêm cột số thứ tự hàng (không có ghế)
        seatCol.push({
            col: "",
            rowBusiness: item.startRowEco - 1, // số lượng hàng ghế thương gia
            rowNormal: item.rows - item.startRowEco + 1, // số lượng hàng ghế phổ thông
            missBusiness: 0,
            missNormal: 0,
        });

        return {
            flightId: flight.flightId,
            flightCode: flight.flightCode,
            aircraftType: flight.aircraftType,
            departureTime: departureTimeObj,
            arrivalTime: arrivalTimeObj,
            departureCode: from || flight.departureCode,
            arrivalCode: to || flight.arrivalCode,
            departureCity: flight.departureCity,
            arrivalCity: flight.arrivalCity,
            status: flight.status,
            rows: item.rows,
            cols: item.cols,
            nameCols: cols,
            startRowBus: item.startRowBus,
            startRowEco: item.startRowEco,
            standardPrice: item.standardPrice,
            economyOptions,
            businessOptions,
            seatCol,
            seats: item.seats, // Lưu danh sách seats để kiểm tra trạng thái
            specificSoldoutSeats: specificSoldoutSeats
        }
    })
}

export const useFlightData = (departureCity, arrivalCity, flightDate) => {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const initialFetchDoneRef = useRef(false)

    const fetchFlights = useCallback(async (from, to, date, setState) => {
        try {
            const url = `/api/flights/search?departureCity=${from}&arrivalCity=${to}&flightDate=${date}`
            const response = await axios.get(url)

            if (response.status === 200) {
                const transformedData = transformFlight(response.data.data, from, to)
                setState(transformedData)
            } else {
                throw new Error(response.data.message || "Dữ liệu không hợp lệ từ API search")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }, [setError])

    const fetchSuggessionFlight = useCallback(async (setState) => {
        try {
            const response = await axios.get("/api/flights/suggesion", {timeout: 180000})
            if (response.status === 200) {
                const transformedData = transformFlight(response.data.data)
                console.log(transformedData)
                setState(transformedData)
            } else {
                throw new Error(response.data.message || "Không thể fetch API Flights Suggestion")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }, [setError])

    useEffect(() => {
        const loadFlights = async () => {
            if (initialFetchDoneRef.current) return // tránh gọi lại lần 2 do Strict Mode
            initialFetchDoneRef.current = true

            setIsLoading(true)
            if (departureCity && arrivalCity && flightDate) {
                await fetchFlights(departureCity, arrivalCity, flightDate, setFlights)
            } else {
                await fetchSuggessionFlight(setFlights)
            }
            setIsLoading(false)
        }

        loadFlights()
    }, [departureCity, arrivalCity, flightDate, fetchFlights, fetchSuggessionFlight])

    return {
        flights,
        isLoading
    }
}


