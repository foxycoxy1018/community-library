const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = require('./book');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number
    },
    cartedBooks: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);