class SeatType {
    constructor({
        typeCode,
        seatName,
        price,
        changeFee,
        refundFee,
        checkedBaggage,
        carryOn,
        service = []
    }) {
        this.typeCode = typeCode || 'EB';
        this.seatName = seatName || "Economy Basic";
        this.price = price;
        this.changeFee = changeFee;
        this.refundFee = refundFee;
        this.checkedBaggage = checkedBaggage;
        this.carryOn = carryOn;
        this.service = service || []
    }

    toObject() {
        return { ...this }
    }
}


export default SeatType