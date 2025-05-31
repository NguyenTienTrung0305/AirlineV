import { admin, db } from '../../database/firebaseAdmin.js'
import Flight from '../../models/flights/Flight.model.js'
import SeatStatus from '../../models/flights/FlightSeatStatus.model.js'
import SeatType from '../../models/flights/FlightSeatType.model.js'

// Collection: flights
// |
// |-- Document (flightId - ví dụ: VN123-20250508)
//     |
//     |-- Trường dữ liệu (tương ứng với các thuộc tính của class Flight):
//     |   - flightCode: "VN123"
//     |   - aircraftType: "Boeing 787"
//     |   - departureCode: "HAN"
//     |   - arrivalCode: "SGN"
//     |   - departureTime: Timestamp (kiểu của Firestore)
//     |   - arrivalTime: Timestamp (kiểu của Firestore)
//     |   - departureCity: "Hà Nội"
//     |   - arrivalCity: "Hồ Chí Minh"
//     |   - status: "OnTime"
//     |
//     |-- Sub-collection: seats
//         |
//         |-- Document (seatCode - ví dụ: A1)
//             |
//             |-- Trường dữ liệu (tương ứng với các thuộc tính của class SeatStatus):
//             |   - row: 1
//             |   - col: "A"
//             |   - typeCode: "business-classic"
//             |   - isAvailable: true
//             |   - isLocked: false
//             |   - lockedBy: null
//             |   - lockExpiresAt: Timestamp (kiểu của Firestore)
//             |   - lockedAt: Timestamp (kiểu của Firestore)
//             |   - soldTo: null
//             |   - soldAt: Timestamp (kiểu của Firestore)

// Collection: seat_types
// |
// |-- Document (typeCode - ví dụ: business-classic)
//     |
//     |-- Trường dữ liệu (tương ứng với các thuộc tính của class SeatType):
//     |   - seatName: "Thương gia cổ điển"
//     |   - price: 1500000
//     |   - changeFee: 200000
//     |   - refundFee: 500000
//     |   - checkedBaggage: 30
//     |   - carryOn: 10
//     |   - service: ["Ưu tiên check-in", "Đồ uống miễn phí"]
function dbGenerateInitialSeats(flightId, rows, cols, seatTypes, startRowBus, startRowEco, standardPrice) {
    const seats = []
    const arrCols = []

    if (typeof cols === 'number' && cols > 0) {
        for (let i = 0; i < cols; i++) {
            arrCols.push(String.fromCharCode(65 + i));
        }
    } else {
        console.error("cols không phải là một số hợp lệ:", cols);
        return []
    }


    for (let i = 1; i <= rows; i++) {
        for (const col of arrCols) {
            const seatCode = `${col}${i}`
            let seatObject
            if (i >= startRowBus && i < startRowEco) {
                const typeCode = seatTypes.find((seatType) => seatType === 'Business')
                seatObject = {
                    flightId: flightId,
                    seatCode: seatCode,
                    row: i,
                    col: col,
                    typeCode: typeCode,
                    standardPrice: standardPrice
                }
                seats.push(seatObject)
            } else {
                const typeCode = seatTypes.find((seatType) => seatType === 'Economy')
                seatObject = {
                    flightId: flightId,
                    seatCode: seatCode,
                    row: i,
                    col: col,
                    typeCode: typeCode,
                    standardPrice: standardPrice
                }
                seats.push(seatObject)
            }
        }
    }
    return seats
}

export const dbCreateFlight = async (flightData, rows, cols, seatTypes, startRowBus, startRowEco, standardPrice) => {
    try {
        const flightDocRef = db.collection('flights').doc(flightData.flightId)

        const flightObject = new Flight(flightData).toObject()
        await flightDocRef.set(flightObject)

        // create seats
        const initialSeatsMap = dbGenerateInitialSeats(flightData.flightId, rows, cols, seatTypes, startRowBus, startRowEco, standardPrice)

        // Sử dụng batch để đảm bảo toàn bộ các thao tác ghi trong batch sẽ thành công hoặc thất bại cùng nhau 
        // Nếu có lỗi xảy ra khi ghi một tài liệu, không có tài liệu nào bị ghi vào Firestore
        const seatsBatch = db.batch()
        const seatCollectionRef = flightDocRef.collection('seats')
        for (const seat of initialSeatsMap) {
            const seatDocRef = seatCollectionRef.doc(seat.seatCode)
            const seatStatusObject = new SeatStatus(seat).toObject()
            seatsBatch.set(seatDocRef, seatStatusObject)
        }

        await seatsBatch.commit()
        console.log(`Đã tạo chuyến bay thành công với ID: ${flightData.flightId}`)
        return true

    } catch (error) {
        console.error('Error creating flight:', error)
        return false
    }
}

export const dbGetFlights = async (flightId) => {
    try {
        const flightDocRef = db.collection('flights').doc(flightId)
        const flightSnap = await flightDocRef.get()
        if (flightSnap.exists) {
            return flightSnap.data()
        } else {
            console.log(` Không tìm thấy chuyến bay với ID: ${flightId}`)
            return null
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin chuyến bay:", error)
        return null
    }
}

// get all seats
export const dbGetFlightSeats = async (flightId) => {
    try {
        const seatsCollectionRef = db.collection('flights').doc(flightId).collection('seats')
        const seatsSnap = await seatsCollectionRef.get()
        const seatsData = []
        seatsSnap.forEach(doc => {
            seatsData.push(new SeatStatus(doc.data()))
        })

        return seatsData
    } catch (error) {
        console.error("Lỗi khi lấy danh sách ghế của chuyến bay:", error)
        return []
    }
}

export const dbCreateTypeSeats = async (seatTypeData) => {
    try {
        const seatTypeDocRef = db.collection('seatTypes').doc(seatTypeData.typeCode)
        const seatTypeObject = new SeatType(seatTypeData).toObject()
        await seatTypeDocRef.set(seatTypeObject)
        return true
    } catch (error) {
        console.log("Lỗi khi tạo loại ghế: ", error)
        return false
    }
}



// lấy thông tin loại ghế
export const dbGetTypeSeat = async (typeCode) => {
    try {
        const seatTypeDocRef = db.collection('seatTypes').doc(typeCode)
        const seatTypeSnap = await seatTypeDocRef.get()
        if (seatTypeSnap.exists) {
            return new SeatType(seatTypeSnap.data())
        } else {
            console.log(`Không tìm thấy loại ghế với mã: ${typeCode}`);
            return null
        }
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin loại ghế ${typeCode}:`, error);
        return null
    }
}

export const dbGetAllTypeSeats = async () => {
    try {
        const seatTypeDocRef = db.collection('seatTypes')
        const seatTypesSnapshot = await seatTypeDocRef.get()
        const seatTypes = seatTypesSnapshot.docs.map(doc => new SeatType(doc.data()).toObject())
        return seatTypes
    } catch (error) {
        console.error("Lỗi khi lấy danh sách loại ghế của chuyến bay:", error)
        return []
    }
}

// lock seat
export async function dbLockSeat(flightId, seatCode, userId, durationMs) {
    try {
        const seatDocRef = db.collection('flights').doc(flightId).collection('seats').doc(seatCode)

        // Transaction sẽ:
        //     Khóa tạm thời document đó
        //     Đảm bảo dữ liệu chưa bị đổi giữa lúc bạn đọc và lúc bạn ghi
        //     Nếu ai đó sửa document này trong lúc bạn chưa ghi → transaction sẽ bị hủy và chạy lại
        //     Nếu vẫn bị lỗi thì sẽ báo lỗi cho bạn
        // Giả sử 2 người A và B cùng muốn đặt ghế A1:
        //     🔹 Với Transaction:
        //     A và B cùng chạy transaction.get(seatDocRef) để đọc ghế A1.
        //     Nếu A ghi được trước → B khi ghi sẽ thấy “dữ liệu đã thay đổi” → transaction của B bị hủy và chạy lại hoặc báo lỗi.
        //     Nhờ vậy, chỉ 1 người đặt được
        await db.runTransaction(async (transaction) => {
            const seatDoc = await transaction.get(seatDocRef)
            if (!seatDoc.exists) {
                throw "Ghế không tồn tại"
            }
            const seatData = seatDoc.data()
            if (!seatData.isAvailable || seatData.isLocked) {
                throw "Ghế không còn trống hoặc đang bị khóa"
            }

            transaction.update(seatDocRef, {
                isLocked: true,
                lockedBy: userId,
                lockedAt: admin.firestore.Timestamp.now(),
                lockExpiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + durationMs),
            })

            console.log(`Ghế ${seatCode} đã được khóa tạm thời cho người dùng ${userId} trên chuyến bay ${flightId}.`)
        })

        return true
    } catch (error) {
        console.error(`Lỗi khi khóa ghế ${seatCode} trên chuyến bay ${flightId}:`, error)
        return false
    }
}

export const dbUnlockExpireSeat = async (flightId) => {
    try {
        const seatCollectionRef = db.collection('flights').doc(flightId).collection('seats')
        const now = admin.firestore.Timestamp.now()
        const querySnapshot = await seatCollectionRef
            .where('isLocked', '==', true)
            .where('lockExpiresAt', '<', now)
            .get()

        const bacth = db.batch()
        querySnapshot.forEach(doc => {
            bacth.update(doc.ref, {
                isLocked: false,
                lockedBy: null,
                lockedAt: null,
                lockExpiresAt: null,
            })
        })

        await bacth.commit()
        console.log(`Đã mở khóa ${querySnapshot.size} ghế hết thời gian chờ trên chuyến bay ${flightId}`)
        return true

    } catch (error) {
        console.error(`Lỗi khi mở khóa ghế hết hạn trên chuyến bay ${flightId}:`, error)
        return false
    }
}

export const dbUnlockSeat = async (flightId, seatCode, userId) => {
    try {
        const seatDocRef = db.collection('flights').doc(flightId).collection('seats').doc(seatCode)
        await db.runTransaction(async (transaction) => {
            const seatDoc = await transaction.get(seatDocRef)
            if (!seatDoc.exists) {
                throw "Ghế không tồn tại"
            }
            const seatData = seatDoc.data()
            if (!seatData.isLocked) {
                throw "Ghế không bị khóa"
            }

            if (seatData.lockedBy !== userId) {
                throw new Error("Bạn không có quyền mở khóa ghế này")
            }

            transaction.update(seatDocRef, {
                isLocked: false,
                lockedBy: null,
                lockedAt: null,
                lockExpiresAt: null
            })
        })
        
        console.log(`Ghế ${seatCode} đã được mở khóa bởi người dùng ${userId} trên chuyến bay ${flightId}.`)

        return true
    } catch (error) {
        console.error(`Lỗi khi mở khóa ghế ${seatCode} trên chuyến bay ${flightId}:`, error)
        return false
    }
}


export const dbPurchaseSeat = async (userId, flightId, seatCode) => {
    try {
        const seatDocRef = db.collection('flights').doc(flightId).collection('seats').doc(seatCode)
        await db.runTransaction(async (transaction) => {
            const seatDoc = await transaction.get(seatDocRef)
            if (!seatDoc.exists) {
                throw "Ghế không tồn tại"
            }
            const seatData = seatDoc.data()
            if (!seatData.isAvailable || seatData.isLocked || seatData.soldTo) {
                throw "Ghế không còn trống, đang bị khóa hoặc đã được mua"
            }

            transaction.update(seatDocRef, {
                isAvailable: false,
                isLocked: false,
                lockedBy: null,
                lockExpiresAt: null,
                soldTo: userId,
                soldAt: admin.firestore.Timestamp.now()
            })
        })

        console.log(`Ghế ${seatCode} đã được mua thành công trên chuyến bay ${flightId} bởi người dùng ${userId}`)
        return true
    } catch (error) {
        console.error(`Lỗi khi mua ghế ${seatCode} trên chuyến bay ${flightId}:`, error)
        return false
    }
}