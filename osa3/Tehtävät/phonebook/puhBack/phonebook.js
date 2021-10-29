require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/people')

app.use(express.json())
app.use(express.static(__dirname+ '/build'))
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

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person =>
      {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    
    })})
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
      res.json(people)
    })
  })

  app.get('/api/info', (req, res) => {
      
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(`Phonebook has ${persons.length} numbers on ${new Date()}`)
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    response.status(204).end()
  })

  const generateId = () => {
    return Math.floor(Math.random() * 2000)
  }
  
  app.post('/api/persons', (request, response) =>{
    const body = request.body
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'content missing' 
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

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })