
const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@webskapp.i3wc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
})

if (process.argv.length<4) {

  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
  if (process.argv.length === 5) {
    person.save().then(response => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  }