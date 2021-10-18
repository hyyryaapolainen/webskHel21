import React, { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
const StatisticLine= ({name, value}) => (
  <tr>
  <td>{name}</td> 
  <td>{value}</td>
  </tr>
)
const Statistics = (props) => {
  let g = props.good;
  let b = props.bad;
  let n = props.neutral;
  return g+b+n > 0 ? 
  (<div>
  <h1>statistics</h1>
  <table>
  <tbody>
  <StatisticLine name="Good" value={g}/>
  <StatisticLine name="Neutral" value={n}/>
  <StatisticLine name="Bad" value={b}/>
  <StatisticLine name="All" value={g+b+n}/>
  <StatisticLine name="Average" value={(g+(b*-1))/(g+b+n)}/>
  <StatisticLine name="Positive" value={(g/(g+b+n))*100+"%"}/>
  </tbody>
  </table>
  </div>)
  :
  (<div>
  <p>No Feedback Given!</p>
  </div>)
}
const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const addGood = () =>{
    setGood(good + 1);
  }
  const addNeutral = () =>{
    setNeutral(neutral + 1);
  }
  const addBad = () =>{
    setBad(bad + 1);
  }
  return (
    <div>
      <div>
      <h1>Give feedback</h1>
      <Button text="Good" handleClick={addGood}/>
      <Button text="Neutral" handleClick={addNeutral}/>
      <Button text="Bad" handleClick={addBad}/>
      </div>
      <Statistics good={good} bad={bad} neutral={neutral}></Statistics>
    </div>
  )
}

export default App