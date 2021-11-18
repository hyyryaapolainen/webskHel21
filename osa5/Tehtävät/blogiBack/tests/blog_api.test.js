const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../blogilista')
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const Blog = require('../models/blogi')
const User = require('../models/user')


describe('Get database information', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('ID is defined', async () => {
    const response = await api.get('/api/blogs')
    for (let i = 0; i<response.length; i++)
    {
      expect(response[i].id).toBeDefined()
    }

  })
  test('There is only two initial blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
  })
})
describe('User authenticated requests', () => {
  let token
  let decodedToken
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const rootUser = new User({ username: 'base', name: "test", passwordHash })
      await rootUser.save()

      const tokenRequest = await api
          .post('/api/login')
          .send(helper.rootUser)
          token = 'bearer ' + tokenRequest.body.token
          decodedToken = jwt.verify(tokenRequest.body.token, process.env.SECRET)
  })
test('a valid blog can be added ', async () => {
  const newBlog = 
  {
      title: "Testi blogi posti",
      author: "Testi",
      url: "Tester",
      likes: 10
  } 
  const respond = await api
    .post('/api/blogs')
    .set({'Authorization': token})
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents).toContain(
    'Testi blogi posti'
  )
})
test('a blog can be deleted by user', async () => {

  const newBlog = 
  {
      title: "Testi blogi posti",
      author: "Testi",
      url: "Tester",
      likes: 10
  } 
  const respond = await api
    .post('/api/blogs')
    .set({'Authorization': token})
    .send(newBlog)

  await api
    .delete(`/api/blogs/${respond.body.id}`)
    .set({'Authorization': token})
    .expect(204)

})
test('blog without title is not added', async () => {
  const newBlog = {
    author: "L7034",
    url: "Skippyprogressive",
    likes: 25
  }     

  await api
    .post('/api/blogs')
    .set({'Authorization': token})
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})
test('blog without url is not added', async () => {
  const newBlog = {
    title: "Testi blogi posti",
    author: "L7034",
    likes: 25
  }     
  await api
    .post('/api/blogs')
    .set({'Authorization': token})
    .send(newBlog)
    .expect(400)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog without likes will initialize as 0', async () => {
  const newBlog = {
    title: "Testi blogi posti",
    url: "Skippyprogressive",
    author: "L7034"
  }     

  const returnedBlog = await api
    .post('/api/blogs')
    .set({'Authorization': token})
    .send(newBlog)
    .expect(200)
  expect(returnedBlog.body.likes).toBeDefined();
  expect(returnedBlog.body.likes).toEqual(0);
})

test('blogs are updated correctly', async () => {
  const initialBlog = {
    title: "Testi blogi posti",
    author: "Testi",
    url: "Tester",
    likes: 10
  }     
  const newBlog = {
    title: "Testi blogi posti",
    author: "Testi",
    url: "Tester",
    likes: 25
  }     
  const savedBlog = await api
    .post('/api/blogs')
    .set({'Authorization': token})
    .send(initialBlog)
    .expect(200)
  
  const updatedBlog = await api
    .put(`/api/blogs/${savedBlog.body.id}`)
    .send(newBlog)
    .expect(200)
  
  expect(updatedBlog.body.id).toEqual(savedBlog.body.id)
  const findBlog = await api
    .get(`/api/blogs/${savedBlog.body.id}`)
  expect(findBlog.body.likes).toEqual(25)

})
})
afterAll(() => {
  mongoose.connection.close()
})
