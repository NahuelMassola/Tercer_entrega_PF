const mongoose = require('mongoose')

const chatsSchema = new mongoose.Schema({
	userEmail: {
		type: String,
		require: true,
	},
	message: {
		type: String,
		require: true,
	},
},{
    versionKey: false,
    timestamps:true
})
const chatsModel = mongoose.model('messages', chatsSchema )

module.exports = chatsModel