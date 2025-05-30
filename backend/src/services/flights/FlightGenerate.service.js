import Flight from "../../models/flights/Flight.model.js"
import SeatStatus from "../../models/flights/FlightSeatStatus.model.js"

const airports = {
    HAN: "Noi Bai International Airport",
    SGN: "Tan Son Nhat International Airport",
    DAD: "Da Nang International Airport",
    CXR: "Cam Ranh International Airport",
    PQC: "Phu Quoc International Airport",
    HPH: "Cat Bi International Airport",
    VCA: "Can Tho International Airport",
    HUI: "Phu Bai International Airport",
    VII: "Vinh International Airport",
    THD: "Tho Xuan Airport"
}

const aircraftTypes = [
    "Airbus A320",
    "Airbus A321",
    "Boeing 737",
    "Boeing 787",
    "Embraer E190",
    "ATR 72",
]

const priceRange = {
    min: 500000,
    max: 3200000,
}

const flightDurations = [60, 75, 90, 105, 120, 135, 150]

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const statusList = ['Start', 'OnTime', 'Landed', 'Delayed', 'Cancelled']
const prob = [0.7, 0.1, 0.05, 0.1, 0.05]
const randomStatus = (status, prob) => {
    const randomNumber = Math.random()
    let cumulativeProb = 0

    for (let i = 0; i < status.length; i++) {
        cumulativeProb += prob[i];
        if (randomNumber <= cumulativeProb) {
            return status[i]
        }
    }

    return status[status.length - 1]
}

const generateTimeSinceNow = () => {
    const now = new Date()

    const randomOffsetMinutes = getRandom(0, 24 * 60) // lấy một số phút ngẫu nhiên trong khoảng 0 → 1440
    const randomTime = new Date(
        // randomOffsetMinutes * 60 * 1000 chuyển số phút thành milliseconds
        // Cộng lại => tạo ra một mốc thời gian cách now một khoảng ngẫu nhiên từ 0 đến 24 giờ
        now.getTime() + randomOffsetMinutes * 60 * 1000
    )

    const roudedMinutes = [0, 15, 30, 45].reduce((accum, currVal) => {
        return Math.abs(currVal - randomTime.getMinutes()) < Math.abs(accum - randomTime.getMinutes()) ? currVal : accum // update accum
    }, 0) // initialValue accum = 0
    randomTime.setMinutes(roudedMinutes, 0, 0)

    return randomTime
}


const generateMockFlight = (departureCode, arrivalCode) => {
    const departureCity = airports[departureCode]
    const arrivalCity = airports[arrivalCode]

    if (!departureCity || !arrivalCity) {
        throw new Error(`Invalid departure or arrival city: ${departureCode} or ${arrivalCode}`)
    }

    const aircraftType = aircraftTypes[getRandom(0, aircraftTypes.length - 1)]

    const departureTime = generateTimeSinceNow()
    const flightDurationInMinutes = flightDurations[getRandom(0, flightDurations.length - 1)]

    const arrivalTime = new Date(departureTime.getTime() + flightDurationInMinutes * 60 * 1000)
    const flightDurationInHours = flightDurationInMinutes / 60

    const status = randomStatus(statusList, prob)

    const flightCode = `VN${getRandom(100, 999)}`
    const flightId = `${departureCode}${flightCode.slice(-3)}-${departureTime.toISOString().slice(2, 10).replace(/-/g, '')}`

    const flight = new Flight({
        flightId,
        flightCode,
        aircraftType,

        departureCode,
        arrivalCode,
        departureTime,
        arrivalTime,

        departureCity,
        arrivalCity,

        status
    })

    // rows, cols, seatTypes, startRowBus, startRowEco, standardPrice
    const rows = getRandom(12, 14)
    const cols = getRandom(5, 7)
    const seatType = ["Business", "Economy"]
    const startRowBus = 1
    const startRowEco = Math.floor(rows / 3)
    const standardPrice = Math.floor((getRandom(priceRange.min, priceRange.max) / 1000) * 1000)

    return {
        flight,
        rows,
        cols,
        seatType,
        startRowBus,
        startRowEco,
        standardPrice
    }
}


const generateMockFlights = (departureCity, arrivalCity) => {
    if (departureCity.length > 1 || arrivalCity.length > 1) {
        departureCity = departureCity.split(" ")[0]
        arrivalCity = arrivalCity.split(" ")[0]
    }
    console.log(departureCity + " " + arrivalCity)
    const numFlights = getRandom(1, 3)
    const flights = []
    for (let i = 0; i < numFlights; i++) {
        flights.push(generateMockFlight(departureCity, arrivalCity))
    }
    return flights
}


const generateFlightsSuggestion = () => {
    const flightCode = Object.keys(airports)
    const suggestion = []

    const numSuggestion = getRandom(1, 3)
    for (let i = 1; i <= numSuggestion; i++) {
        const departureCity = flightCode[getRandom(0, flightCode.length - 1)]
        let arrivalCity
        do {
            arrivalCity = flightCode[getRandom(0, flightCode.length - 1)]
        } while (arrivalCity === departureCity)

        const flights = generateMockFlights(departureCity, arrivalCity)
        suggestion.push(...flights)
    }

    return suggestion
}

export { generateMockFlight, generateMockFlights, generateFlightsSuggestion }