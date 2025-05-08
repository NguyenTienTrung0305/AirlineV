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
        this.typeCode = typeCode || 'economy-basic';
        this.seatName = seatName;
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