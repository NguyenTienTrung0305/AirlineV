import SeatStatus from "./FlightSeatStatus.model.js";

class Flight {
    constructor({
        flightId,
        flightCode,
        aircraftType,

        departureCode,
        arrivalCode,
        departureTime, // Date Object
        arrivalTime, // Date Object
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
            // Nếu là ISO String
            if (typeof departureTime === 'string') {
                this.departureTime = new Date(departureTime);
            } else if (departureTime instanceof Date && !isNaN(departureTime.getTime())) {
                // Nếu đã là một Date object hợp lệ
                this.departureTime = departureTime
            }
            // Nếu là dạng firestore timestamp
            else if (departureTime.seconds) {
                this.departureTime = new Date(departureTime.seconds * 1000);
            } else {
                throw new Error('Invalid departureTime format')
            }
        } else {
            this.departureTime = null;
        }

        if (arrivalTime) {
            if (typeof arrivalTime === 'string') {
                this.arrivalTime = new Date(arrivalTime)
            } else if (arrivalTime instanceof Date && !isNaN(arrivalTime.getTime())) {
                this.arrivalTime = arrivalTime
            }
            else if (arrivalTime.seconds) {
                this.arrivalTime = new Date(arrivalTime.seconds * 1000)
            } else {
                throw new Error('Invalid arrivalTime format')
            }
        } else {
            this.arrivalTime = null
        }

        if (this.departureTime && isNaN(this.departureTime.getTime())) {
            throw new Error('Invalid departureTime')
        }
        if (this.arrivalTime && isNaN(this.arrivalTime.getTime())) {
            throw new Error('Invalid arrivalTime')
        }

        this.status = status || "Landed"
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