const blogRouter = require("express").Router()
const Blog = require("../models/blogi")

blogRouter.get("/", (request, response) => {
	Blog.find({}).then(Blogs => {
		response.json(Blogs.map(Blog => Blog.toJSON()))
	})
})

blogRouter.get("/:id", (request, response, next) => {
	Blog.findById(request.params.id)
		.then(Blog => {
			if (Blog) {
				response.json(Blog.toJSON())
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

blogRouter.post("/", (request, response, next) => {
	const body = request.body

	const Blog = new Blog({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	Blog.save()
		.then(savedBlog => {
			response.json(savedBlog.toJSON())
		})
		.catch(error => next(error))
})

blogRouter.delete("/:id", (request, response, next) => {
	Blog.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

blogRouter.put("/:id", (request, response, next) => {
	const body = request.body

	const Blog = {
		content: body.content,
		important: body.important,
	}

	Blog.findByIdAndUpdate(request.params.id, Blog, { new: true })
		.then(updatedBlog => {
			response.json(updatedBlog.toJSON())
		})
		.catch(error => next(error))
})

module.exports = blogRouter