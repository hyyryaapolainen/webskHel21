import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notiMessage, setNotiMessage] = useState(null)

  const setNoti = (content, id) => {
    setNotiMessage({c: content,id: id})
    setTimeout(() => {
      setNotiMessage(null)
    }, 1000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNoti("Logged in!", 1)
    } catch (exception) {
      console.log(exception.response)
      setNoti(exception.response.data.error,0)
    }
  }
  const handleLogOut = (event) => {
    event.preventDefault()
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.clear()
    setNoti("Logged out!", 1)
  }
  const handlePost = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title: title,
        author: author,
        url: url})
      const refblogs = await blogService.getAll()
      setBlogs(refblogs)
      setAuthor('')
      setTitle('')
      setUrl('')
      setNoti(`${newBlog.title} added to your blogs!`, 1)
    }
    catch(exception)
    {
      setNoti(exception.response.data.error, 0)
    }
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
  const blogForm = () => (
    <form onSubmit={handlePost}>
      <div>
        title
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">post</button>
    </form>  
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])
  
  return (
    <div>
<Notification message={notiMessage} />
        {user === null ? 
        <div>
        <h2>Log in to application!</h2>
          {loginForm()}
        </div>
        :
        <div>
        <h1> BLOGS </h1>
        <h2> {user.username} logged in!</h2><button onClick={(event) => handleLogOut(event)}> logout </button>
        <p></p>
        {blogForm()}
        <p> your blogs: </p>
        {blogs.filter(b => b.user.username === user.username).map(blog =>
                <Blog key={blog.id} blog={blog} />
                )}
        </div>
        }
    </div>
  )
}

export default App