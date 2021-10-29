require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/people')
const { request } = require('express')
app.use(express.static(__dirname+ '/build'))

app.use(express.json())
app.use(cors())
morgan.token('responseJSON', function (req, res) 
{return JSON.stringify(res.person)})
const morganL = morgan(':method :url :status - :response-time ms :responseJSON')
app.use(morganL)
let persons = [
      {
        "name": "Arto Hellas",
        "number": "39-44-5323523",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "aaa",
        "number": "aaaa2",
        "id": 5
      },
      {
        "name": "testi",
        "number": "32553352",
        "id": 6
      },
      {
        "name": "Testi after service",
        "number": "124124",
        "id": 7
      },
      {
        "name": "aaafsf",
        "number": "aa",
        "id": 8
      },
      {
        "name": "fsasfsfa",
        "number": "33",
        "id": 9
      }
    ]

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person =>{
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    })
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
      res.json(people)
    })
  })

  app.get('/api/info', (req, res) => {
      
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  Person.find({}).then(people => {
    res.end(`Phonebook has ${people.length} numbers on ${new Date()}`)
  })
  })
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })
  const numberAlreadyDeleted = (error,request,response, next) => {
    console.error(error.message)
    return response.status(404).send({error: 'number already removed'})
  }
  app.use(numberAlreadyDeleted)

  const generateId = () => {
    return Math.floor(Math.random() * 2000)
  }
  
  app.post('/api/persons', (request, response) =>{
    const body = request.body
    
    if (!body.name) {
      return response.status(555).json({ 
        error: 'content missing' 
      })
    }
    if (!Number.isInteger(parseInt(body.number)))
    {
      return response.status(690).json({ 
        error: 'not a number' 
      })
    }
    if(persons.find(a => a.name === body.name))
    {
        return response.status(305).json({ 
          error: 'Person with name already exists' 
        })
    }
    if(persons.find(a => a.number === body.number))
    {
        return response.status(69).json({ 
          error: 'content missing' 
        })
      }
    const person = new Person({
      name: body.name,
      number: body.number || "0000000000",
      date: new Date(),
      id: generateId()
    })
    person.save().then(savedInfo => {
      response.json(savedInfo)
    })
  })
  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  const errorHandler = (error, request, response, next) =>
  {
    if(error.name ==='CastError')
    {
      return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
  }

  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })