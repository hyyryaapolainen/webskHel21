import React, { useState, useEffect } from 'react'
import axios from 'axios'

//OPENWEATHERMAP.ORG
const weatherApi = process.env.REACT_APP_WEATHER_API_KEY;

const Country = ({country}) => (
  <div>
  <p>{country.name.common} {country.flag}</p>
  </div>
)
const CountryFull = ({country}) => {

  const [weather, setWeather] = useState(undefined)
  
  useEffect(() => {
    axios
    .get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${weatherApi}`)
    .then(response => {
      setWeather(response.data)
    })
  }, [])
  return(
  <div>
    <h1>{country.name.common}</h1>
    {country.altSpellings.map((a, i) => <li key={i}>{a}</li>)}
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h2>languages</h2>
    {Object.values(country.languages).map((a, i) => <li key={i}>{a}</li>)}
    <img width="200" height="200" src={country.coatOfArms.png} alt="coat of arms"></img>
    <h2>{`Weather in ${country.capital}`}</h2>
    <p>temperature F {weather.main.temp}</p>
    <p>feelslike F {weather.main.feels_like}</p>
    <p>wind {weather.wind.speed} m/s</p>
  </div>
)}
const DisplayField = ({list, filter, onClick}) => {
  const filtered = list.filter(a => a.name.common.toLowerCase().startsWith(filter.toLowerCase()))
  
  if(filtered.length > 10 && filter.length > 0)
  {
    return (<div><p>Too many matches!</p></div>)
  }
  else if(filtered.length > 1 && filtered.length <= 10)
  {
    return (
    <div>
    {filtered.map((country,i)=> 
    <div>
    <Country key ={i} country={country}></Country>
    <button value={country.name.common} onClick={(event) => onClick(event)}>show</button>
    </div>
    )}
    </div>)
  }
  else if(filtered.length === 1)
  {
    return <div>
      <CountryFull 
      country={filtered[0]} /></div>
  }
  else if(filter.length === 0)
  {
    return (
    <div>
    <p>Start typing to find matches!</p>
    {filtered.map((country,i)=>
    <Country key ={i} country={country}></Country>)}
    </div>)
 
}
  return (
    <div><p>No matches!</p></div>
  )
}


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

  function sortABC( a, b ) {
    if ( a.name.common < b.name.common ){
      return -1;
    }
    if ( a.name.commob > b.name.common ){
      return 1;
    }
    return 0;
  }
  useEffect(() => {
    const sendRequest = async () => {
      try{
        const r = await axios.get(`https://restcountries.com/v3.1/all`)
        setCountries(r.data.sort(sortABC))
      }
      catch
      {
        setCountries([])
      }
    }
    sendRequest();
  }, [])
  const handleFilterFieldChange = (event) => {
    setFilter(event.target.value)
  }
  const handleViewChange = (event) => {
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
      <DisplayField filter={filter} list={countries} onClick={(event) => handleViewChange(event)}></DisplayField>
      </div>
    </div>
  )
}

export default App