const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
	email: {
		type: String,
		required: true
	},
	role:{
		type: String
	},
    blocked: {
        type: Boolean,
        default: false
    }
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User)