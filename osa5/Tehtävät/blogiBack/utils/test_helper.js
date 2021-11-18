const Blog = require('../models/blogi')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "ensimmäinen blogi posti",
        "author": "L7034",
        "url": "Skippyalternative",
        "likes": 10
    },
    {
        "title": "Toinen blogi posti",
        "author": "L7034",
        "url": "Skippyprogressive",
        "likes": 25
    }     
]
const nonExistingId = async () => {
  const blog = new Blog({ title: 'Tester', author: 'Tester' })
  await blog.save()
  await blog.remove()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
const rootUser = {
    username: 'base',
    password: 'sekret'
  }

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, rootUser
}