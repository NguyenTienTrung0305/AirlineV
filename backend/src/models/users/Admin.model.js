class Admin {
    constructor({
        uid = null,
        firstName,
        lastName,
        email,
        phoneNumber = null,
        dateOfBirth = new Date("1990-01-01"),
        gender = "male",
        address = null,
        role = "admin",
        createdAt = null,
        updatedAt = null,
    }) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toObject() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            uid: this.uid,
            phoneNumber: this.phoneNumber,
            dateOfBirth: this.dateOfBirth,
            gender: this.gender,
            address: this.address,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export default Admin;