const blogRouter = require("express").Router()
const Blog = require("../models/blogi")

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

blogRouter.post("/", async (request, response, next) => {
	const body = request.body
	const user = await User.findById(body.userId)

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
		response.status(400).end()
	}
})

blogRouter.delete("/:id", async (request, response, next) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
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