import React, { useState } from 'react'

const Number = ({name, number}) => (
  <div>
  <p>{name} {number}</p>
  </div>
)
const Phonebook = ({list, filter}) => (
  <div>
  <h2>Numbers</h2>  
  {list.filter(person => person.name
    .toLowerCase()
    .startsWith(filter.toLowerCase()))
    .map((person, i) =>
      <Number key={i} name={person.name} number={person.number}/>)}
  </div>
)

const Field = ({onChange, fieldName, value}) => {
    return(
        <div>{fieldName} 
          <input value={value} onChange={(event) => onChange(event)}/>
        </div>
    )
  }
  const Form = ({fields, onSubmit}) => {
    return (
      <form onSubmit={(event) => onSubmit(event)}>
      {fields.map((field, i) => <Field key={i} fieldName={field.fieldName} value={field.value} onChange={field.onChange}/>)} <div>
      <button type="submit" >add</button>
      </div>
      </form>
    )
}
const App = () => {
  const addNewNumber = (event) =>
  {
    event.preventDefault()
    if (persons.filter(a => a.name === newName).length > 0)
    {
      alert(`${newName} is already added to phonebook`)
    }
    else{
    setPersons(persons.concat({name: newName, number: newNumber}))
    setNewName('')
    setNewNumber('')
    }
  }
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  
  const handleFieldChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberFieldChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterFieldChange = (event) => {
    setFilter(event.target.value)
  }
  const fields = [
    {
      onChange: (event) => handleFieldChange(event),
      fieldName: "Add Name",
      value: newName
    },
    {
      onChange: (event) => handleNumberFieldChange(event),
      fieldName: "Add Number",
      value: newNumber
    }
  ]
  return (
    <div>
      <h2>Phonebook</h2>
      <Field onChange={(event) => handleFilterFieldChange(event)}
      fieldName="Filter"
      value={filter}/>
      <Form fields={fields} 
      onSubmit={(event) => addNewNumber(event)}/>
      <Phonebook list={persons} filter={filter}/>
      </div>
  )
}

export default App


/*
    "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json"
*/