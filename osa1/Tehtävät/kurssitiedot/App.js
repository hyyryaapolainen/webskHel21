import React from 'react'

const Header = (props) =>(
  <div>
    <h1>{props.course}</h1>
  </div>
)
const Content = (props) =>{
  const p = props.parts;
  return(
  <div>
    <Part
    p = {p[0].name} ex = {p[0].exercises}
    />
    <Part
    p ={p[1].name}  ex = {p[1].exercises}
    />
    <Part
    p ={p[2].name}  ex = {p[2].exercises}
    />
  </div>
)
}
const Part = (props) =>(
      <p>
      {props.p} {props.ex}
      </p>
)
const Total = (props) =>(
  <div>
    Total number of exercises
    {
        props.parts[0].exercises 
      + props.parts[1].exercises
      + props.parts[2].exercises}
  </div>
)
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course.name}/>
      <Content 
      parts = {course.parts}
      />
      <Total parts = {course.parts}
      />
    </div>
  )
}

export default App;
