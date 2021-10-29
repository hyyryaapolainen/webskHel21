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
      <Number key={i} name={person.name} number={person.number} onDelete={(id) => onDelete(person.id)}/>)}
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
const Notification = ({ message }) => {
  const errorStyle = {
    color: 'red',
    backGround: 'pink',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  const successStyle = {
    color: 'green',
    backGround: 'lightgreen',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  
  if (message === null) {
    return null
  }
  if (message.id === 0)
  {
    return (
      <div style={errorStyle}>
        {message.c}
      </div>
    )
  }
  else{
    return (
      <div style={successStyle}>
        {message.c}
      </div>
    )
  }
}
const App = () => {

  const addNewNumber = (event) =>
  {
    event.preventDefault()
    const newEntry = {name: newName, number: newNumber}
    const personCheck = [...persons].filter(a => a.name === newName)
    if (personCheck.length > 0)
    {
      if (personCheck[0].number !== newNumber)
      {
        if(window.confirm(`${newName} is already added to phonebook, replace old number with new one?`))
        {
          const id = personCheck[0].id
          puhelinService
          .getAll()
          .then(response=> {
           setPersons(response.data) 
          })
          puhelinService
          .update(id, newEntry)
          .then(returnedNmb => {
            setPersons(persons.map(p => p.id !== returnedNmb.data.id ? p : returnedNmb.data))
            setNoti(`${newEntry.number}updated number!`, 1)
          })
          .catch(error => {setNoti('updating number failed', 0)})
          setNewName('')
          setNewNumber('')
        }
        }
        else {
          alert(`${newName} is already added to phonebook`)
      }
    }
    else{
    puhelinService
      .create(newEntry)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNoti(`${newEntry.name}Added number!`, 1)
      })
      .catch(error => {console.log(error);setNoti(`Adding number failed ${error}`, 0)})
    setNewName('')
    setNewNumber('')
    }
  }
  const deleteNumber = (id) =>
  {
    const personToDelete = [...persons].find(a=> a.id === id).name
    if(window.confirm(`Do you really want to delete ${personToDelete}`))
    {
      puhelinService
      .remove(id)
      .then(response => {
        setNoti(`Deleted ${personToDelete}'s number!`, 1)
        setPersons(persons.filter(a => a.id !== id))
      })
      .catch(error=>{setNoti(`Deleting number failed ${error}`, 0)})
      puhelinService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
    }
  }

  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [notiMessage, setNotiMessage] = useState(null)
  const setNoti = (content, id) => {
    setNotiMessage({c: content,id: id})
    setTimeout(() => {
      setNotiMessage(null)
    }, 5000)
  }

  useEffect(() => {
    const refreshPage = () => {
      puhelinService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
    }
    refreshPage()
    },[])
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
      <Notification message={notiMessage} />
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
