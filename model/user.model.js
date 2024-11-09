const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
    constructor(mobile, pin) {
        this.mobile = mobile;
        this.pin = pin;
    }

    getUserWithSameMobile() {
        return db.getDb().collection('users').findOne({ mobile: this.mobile });
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameMobile();
        console.log(existingUser);
        if (existingUser) {
            return true;
        }
        return false;
    }

    async signup() {
        const hashedPin = await bcrypt.hash(this.pin, 12);

        await db.getDb().collection('users').insertOne({
            mobile: this.mobile,
            pin: hashedPin
        });
    }

    hasMatchingPin(hashedPin) {
        return bcrypt.compare(this.pin, hashedPin);
    }
}

module.exports = User;