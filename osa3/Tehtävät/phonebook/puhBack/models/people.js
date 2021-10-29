/* eslint-env es6 */
/* eslint-disable no-console */

const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url)
	.then(console.log("connected to MongoDB"))
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message)
	})

const personSchema = new mongoose.Schema({
	name: { type: String,
		minLength: 3,
		required: true },
	number: {
		type: String,
		minLength: 8,
		required: true
	},
	date: Date,
	Id: Number

})

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Person", personSchema)