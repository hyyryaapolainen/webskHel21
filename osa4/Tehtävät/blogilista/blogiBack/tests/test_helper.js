const Blog = require('../models/Blog')

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

const notesInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, notesInDb
}