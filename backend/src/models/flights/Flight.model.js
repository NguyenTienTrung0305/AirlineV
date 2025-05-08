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
        this.departureTime = departureTime ? new Date(departureTime.seconds * 1000) : null;
        this.arrivalTime = arrivalTime ? new Date(arrivalTime.seconds * 1000) : null;

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