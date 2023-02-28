const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isCarted: {
        type: Boolean,
        default: false
    },
    isSold: {
        type: Boolean,
        default: false
    },
    description: String
})

module.exports = mongoose.model('Book', BookSchema);