// Liên kết ghế + người dùng + chuyến bay. Mỗi vé là một ghế được đặt thành công.
class Ticket {
    constructor({
        ticketId = null,
        userId,
        flightId,
        seatCode, // "B5"
        classType = "economy", // or "business"
        bookingTime = new Date(),
        price = 0,
    }) {
        this.ticketId = ticketId;
        this.userId = userId;
        this.flightId = flightId;
        this.seatCode = seatCode;
        this.classType = classType;
        this.bookingTime = bookingTime;
        this.price = price;
    }

    toObject() {
        return {
            ticketId: this.ticketId,
            userId: this.userId,
            flightId: this.flightId,
            seatCode: this.seatCode,
            classType: this.classType,
            bookingTime: this.bookingTime,
            price: this.price,
        };
    }
}
