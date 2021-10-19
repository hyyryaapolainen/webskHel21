import React, { useState, useEffect } from 'react'
import puhelinService from './services/puhelin'

const Number = ({name, number, onDelete}) => (
  <div>
  <p>{name} {number}</p>
  <button onClick={onDelete}>Delete</button>
  </div>
)
const Phonebook = ({list, filter, onDelete}) => (
  <div>
  <h2>Numbers</h2>  
  {list.filter(person => person.name
    .toLowerCase()
    .startsWith(filter.toLowerCase()))
    .map((person, i) =>
      <Number key={i} name={person.name} number={person.number} onDelete={(id) => onDelete(id)}/>)}
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
    const newEntry = {name: newName, number: newNumber}
    if (persons.filter(a => a.name === newName).length > 0)
    {
      alert(`${newName} is already added to phonebook`)
    }
    else{
    puhelinService
      .create(newEntry)
      .then(response => {
        setPersons(persons.concat(response.data))
      })
    setNewName('')
    setNewNumber('')
    }
  }
  const deleteNumber = (id) =>
  { 
    puhelinService
    .remove(id)
    .then(response => {
      setPersons(persons.concat(response.data))
    })
  setNewName('')
  setNewNumber('')
  }

  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  useEffect(() => {
    puhelinService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])
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
      <Phonebook list={persons} filter={filter} onDelete={(id) => deleteNumber(id)}/>
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