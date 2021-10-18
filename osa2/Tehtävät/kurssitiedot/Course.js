import React from 'react'

const Header = ({text}) => (
<div>
<h1>{text}</h1>
</div>)

const Content = ({parts}) => {
  return(
  <div>
  {parts.map(course =>
  <Part key={course.id} name={course.name} ex={course.exercises}/>
  )}
  <Total parts={parts}></Total>
  </div>
)}
const Part = ({name,ex}) => (
  <div>
    <p> {name} {ex} </p>
  </div>
)
const Total= ({parts}) => {
  const total = parts.reduce(function (sum, obj){return sum + obj.exercises}, 0)
  return(
  <div>
    <p>Total exercises {total}</p>
  </div>
)}
const Course = ({course}) => 
{
  return(
    <div>
     <Header text={course.name}></Header>
     <Content parts={course.parts}></Content> 
    </div>
)}


export default Course;
