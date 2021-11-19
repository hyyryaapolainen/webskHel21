const blogRouter = require("express").Router()
const Blog = require("../models/blogi")
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const User = require("../models/user")

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
	response.json(blogs.map(b => b.toJSON()))
})

blogRouter.get("/:id", async (request, response, next) => {
	const findBlog = await Blog.findById(request.params.id)
	if (findBlog) {
		response.json(findBlog.toJSON())
	} else {
		response.status(404).end()
	}
})

blogRouter.post("/", middleware.userExtractor,async (request, response, next) => {
	const body = request.body
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = request.user

	const newBlog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		date: new Date(),
		user: user._id
	})
	if(newBlog.url && newBlog.title)
	{
		const savedBlog = await newBlog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		response.json(savedBlog.toJSON())
	}
	else{
		response.status(400).json({error: 'Missing url or title'})
	}
})

blogRouter.delete("/:id", async (request, response, next) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)
	const blogToRemove = await Blog.findById(request.params.id)
	console.log(blogToRemove)
	if (user.id = blogToRemove.user)
	{
		const removedBlog = await Blog.findByIdAndRemove(request.params.id)
		response.status(204).json(removedBlog.toJSON())
	}
	else{
	response.status(401).end()
	}
})

blogRouter.put("/:id", async (request, response, next) => {
	const body = request.body
	const newBlog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		date: new Date(),
		_id: request.params.id
	})
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true})
	response
		.json(updatedBlog.toJSON())
})

module.exports = blogRouter