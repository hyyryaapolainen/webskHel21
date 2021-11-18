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
    } catch (exception) {
      setTimeout(() => {
      }, 5000)
    }
  }
  const handleLogOut = (event) => {
    event.preventDefault()
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.clear()
  }
  const handlePost = async (event) => {
    event.preventDefault()
    await blogService.create({
      title: title,
      author: author,
      url: url})
    const refblogs = await blogService.getAll()
    setBlogs(refblogs)
    setAuthor('')
    setTitle('')
    setUrl('')
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