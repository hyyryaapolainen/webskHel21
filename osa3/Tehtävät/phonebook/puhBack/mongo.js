
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@webskapp.i3wc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
console.log(process.argv[2])
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Mongoose Hellas',
  number: '04405553214'
})

person.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close()
})