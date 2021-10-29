require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/people")
app.use(express.static("/build"))
app.use(express.json())
app.use(cors())
morgan.token("responseJSON", function (req, res)
{return JSON.stringify(res.person)})
const morganL = morgan(":method :url :status - :response-time ms :responseJSON")
app.use(morganL)

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})
app.get("/api/persons", (req, res) => {
	Person.find({}).then(people => {
		res.json(people)
	})
})

app.get("/api/info", (req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" })
	Person.find({}).then(people => {
		res.end(`Phonebook has ${people.length} numbers on ${new Date()}`)
	})
})

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(response.status(204).end())
		.catch(error => next(error))
})

const generateId = () => {
	return Math.floor(Math.random() * 2000)
}
app.post("/api/persons", (request, response, next) => {
	const body = request.body
	const person = new Person({
		name: body.name,
		number: body.number || "0000000000",
		date: new Date(),
		id: generateId()
	})
	person.save().then(savedInfo => {
		response.json(savedInfo)
	})
		.catch(error => next(error))
})
app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body
	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})
const errorHandler = (error, request, response, next) =>
{
	if(error.name ==="CastError")
	{
		return response.status(400).send({ error: "malformatted id" })
	}
	else if(error.name === "ValidationError"){
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})