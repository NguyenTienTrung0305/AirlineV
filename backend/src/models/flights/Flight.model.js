import SeatStatus from "./FlightSeatStatus.model";

class Flight {
    constructor({
        flightId,
        flightCode,
        aircraftType,

        departureCode,
        arrivalCode,
        departureTime,
        arrivalTime,
        departureCity,
        arrivalCity,

        status,
    }) {
        if (!['Start', 'OnTime', 'Landed', 'Delayed', 'Cancelled'].includes(status)) {
            throw new Error('status is invalid');
        }
        this.flightId = flightId;
        this.flightCode = flightCode;
        this.aircraftType = aircraftType;

        this.departureCode = departureCode;
        this.arrivalCode = arrivalCode;
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;

        if (departureTime) {
            if (typeof departureTime === 'string') {
                // Nếu là chuỗi ISO 8601 (từ client)
                this.departureTime = new Date(departureTime);
            } else if (departureTime.seconds) {
                // Nếu là Timestamp từ Firestore
                this.departureTime = new Date(departureTime.seconds * 1000);
            } else {
                throw new Error('Invalid departureTime format');
            }
        } else {
            this.departureTime = null;
        }

        if (arrivalTime) {
            if (typeof arrivalTime === 'string') {
                // Nếu là chuỗi ISO 8601 (từ client)
                this.arrivalTime = new Date(arrivalTime);
            } else if (arrivalTime.seconds) {
                // Nếu là Timestamp từ Firestore
                this.arrivalTime = new Date(arrivalTime.seconds * 1000);
            } else {
                throw new Error('Invalid arrivalTime format');
            }
        } else {
            this.arrivalTime = null;
        }

        // Kiểm tra tính hợp lệ của ngày
        if (this.departureTime && isNaN(this.departureTime.getTime())) {
            throw new Error('Invalid departureTime');
        }
        if (this.arrivalTime && isNaN(this.arrivalTime.getTime())) {
            throw new Error('Invalid arrivalTime');
        }

        this.status = status || "Landed";
    }

    isDelayed() {
        return this.status === "Delayed"
    }

    toObject() {
        return {
            flightId: this.flightId,
            flightCode: this.flightCode,
            aircraftType: this.aircraftType,

            departureCode: this.departureCode,
            arrivalCode: this.arrivalCode,
            departureCity: this.departureCity,
            arrivalCity: this.arrivalCity,
            departureTime: this.departureTime,
            arrivalTime: this.arrivalTime,

            status: this.status,
        }
    }
}

export default Flight