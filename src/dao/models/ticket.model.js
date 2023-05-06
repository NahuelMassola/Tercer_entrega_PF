const mongoose = require('mongoose')
const ticketCollection = "ticket"

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    purchace_datetime: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    parcharser: {
        type: String,
        required: true,
    }
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)
module.exports = ticketModel