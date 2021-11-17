const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../blogilista')
const helper = require('../utils/test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

describe('User authentication', () => {
  beforeEach(async () => {

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const rootUser = new User({ username: 'base', name: "test", passwordHash })
    await rootUser.save()

    const userHash = await bcrypt.hash('user', 10)
    const testUser = new User({username: 'authentication', name: 'testi testerinen', userHash})
    await testUser.save()
    
  })
  test('User can login', async () => {
    const rootUser = {
      username: 'base',
      password: 'sekret'
    }
    const respond = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
  })
  test('User receives token', async () => {

    const rootUser = {
      username: 'base',
      password: 'sekret'
    }
    const respond = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
    expect(respond.body.token)
  })
})
describe('User posting', () => {
  beforeEach(async () => {

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const rootUser = new User({ username: 'base', name: "test", passwordHash })
    await rootUser.save()
    
  })
  test('Anonymous cannot post', async () => {
    const testBlog = {
      title: "body.title",
      author: "body.author",
      url: "body.url",
      likes: 0
    }
    const respond = await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(401)
  
  })
  test('User can post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const testBlog = {
      title: "body.title",
      author: "body.author",
      url: "body.url",
      likes: 0
    }
    const rootUser = {
      username: 'base',
      password: 'sekret'
    }
    const tokenRequest = await api
    .post('/api/login')
    .send(rootUser)
    
    const token = 'bearer ' + tokenRequest.body.token
    const decodedToken = jwt.verify(tokenRequest.body.token, process.env.SECRET)
    const respond = await api
      .post('/api/blogs')
      .set({'Authorization': token})
      .send(testBlog)
      .expect(200)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    const user = await User.findById(decodedToken.id)
    expect(respond.body.user).toEqual(user.id)
    const blogs = blogsAtEnd.map(u => u.title)
    expect(blogs).toContain(testBlog.title)
  })
})
afterAll(() => {
  mongoose.connection.close()
})
