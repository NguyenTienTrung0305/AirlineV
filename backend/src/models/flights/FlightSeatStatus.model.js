class SeatStatus {
    constructor(data) {
        this.seatCode = data.seatCode;
        this.row = data.row;
        this.col = data.col;
        this.typeCode = data.typeCode;

        this.standardPrice = data.standardPrice

        this.isAvailable = data.isAvailable || true;
        this.isLocked = data.isLocked || false;
        this.lockedBy = data.lockedBy || null;
        this.lockExpiresAt = data.lockExpiresAt ? new Date(data.lockExpiresAt.seconds * 1000) : null;
        this.lockedAt = data.lockedAt ? new Date(data.lockedAt.seconds * 1000) : null;

        this.soldTo = data.soldTo || null;
        this.soldAt = data.soldAt ? new Date(data.soldAt.seconds * 1000) : null;
    }

    toObject() {
        return {
            seatCode: this.seatCode,
            row: this.row,
            col: this.col,
            typeCode: this.typeCode,
            standardPrice: this.standardPrice,

            isAvailable: this.isAvailable,
            isLocked: this.isLocked,
            lockedBy: this.lockedBy,
            lockExpiresAt: this.lockExpiresAt,
            lockedAt: this.lockedAt,
            soldTo: this.soldTo,
            soldAt: this.soldAt,
        };
    }
}

export default SeatStatus