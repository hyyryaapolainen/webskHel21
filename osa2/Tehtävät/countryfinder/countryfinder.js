import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({name, number}) => (
  <div>
  <p>{name} {number}</p>
  </div>
)
const DisplayField = ({list, filter}) => (
  <div>
  <h2>Countries</h2>  
  {list.filter(person => person.name
    .toLowerCase()
    .startsWith(filter.toLowerCase()))
    .map((person, i) =>
      <Country key={i} name={person.name} 
      number={person.number}/>)}
  </div>
)

const Field = ({onChange, fieldName, value}) => {
    return(
        <div>{fieldName} 
          <input value={value} onChange={(event) => onChange(event)}/>
        </div>
    )
  }

const App = () => {

  const [countries, setCountries] = useState([]) 
  const [ filter, setFilter ] = useState('')
  useEffect(() => {
    axios
      .get('https://restcountries.com/#api-endpoints-all').then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterFieldChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
    <div>
      <h2>Country finder</h2>
      <Field onChange={(event) => handleFilterFieldChange(event)}
      fieldName="Find countries"
      value={filter}/>
      </div>
    <div>
    <DisplayField filter ={filter} list={countries}></DisplayField>
    </div>
    </div>
  )
}

export default App