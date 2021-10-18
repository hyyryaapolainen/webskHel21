import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  const [selected, setSelected] = useState(0)

  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [highest, setHighest] = useState(0)

  const RButton = ({ handleClick, text }) => (
    <div>
    <button onClick={handleClick}>
      {text}
    </button>
    </div>
  )
  const Randomize = () =>{
    setSelected(getRandomInt(0, anecdotes.length));
  }
  const getRandomInt = (min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  const AddVote = () => {
    let copy = [...points];
    copy[selected] += 1;
    setPoints(copy)
    var index = points.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    setHighest(index);
  }
  return (
    <div>
      <RButton handleClick={Randomize} text="Randomize"/>
      <div>
      <p>Current</p>
      {anecdotes[selected]}
      </div>
      <div>
      {points[selected]}
      </div>
      <p>Highest voted</p>
      <div>{anecdotes[highest]} {points[highest]}</div>
      <RButton handleClick={AddVote} text="Vote up"></RButton>
    </div>
  )
}

export default App