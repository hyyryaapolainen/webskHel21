const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs')
    response.json(users.map(u => u.toJSON()))
  })


usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (!(body.username) || !(body.password ))
  {
    return response.status(409).json({
      error: 'Missing password or username!'
    })
  }
  else if (body.password.length < 3 || body.username.length < 3)
  {
    return response.status(409).json({
      error: 'Username or password too short!'
    })
  }
  else{
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.json(savedUser)
  }
})

module.exports = usersRouter