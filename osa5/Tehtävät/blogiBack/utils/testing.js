const palindrome = (string) => {
	return string
		.split("")
		.reverse()
		.join("")
}

const average = array => {
	const reducer = (sum, item) => {
		return sum + item
	}
	return array.length === 0
		? 0
		: array.reduce(reducer, 0) / array.length
}

const totallikes = (array) => {
	const reducer = (sum, item) => {
		return sum + item.likes
	}
	return array.length === 0
		? 0
		: array.reduce(reducer, 0)
}

const favoriteBlog = (array) => {
	return array.length > 0 ? array.sort((a,b) => b.likes - a.likes)[0] : null
}

const mostBlogs = (array) => {
	const authors = []
	for (let i = 0; i<array.length;i++)
	{
		if (authors.find(a => a.author === array[i].author))
		{
			authors.find(a => a.author === array[i].author).blogs += 1
		}
		else
		{
			authors.push({ author: array[i].author, blogs: 1 })
		}
	}
	return authors.length > 0 ? authors.sort((a,b) => b.blogs - a.blogs)[0] : 0
}
const mostLikes = (array) => {
	const authors = []
	for (let i = 0; i<array.length;i++)
	{
		if (authors.find(a => a.author === array[i].author))
		{
			authors.find(a => a.author === array[i].author).likes += array[i].likes
		}
		else
		{
			authors.push({ author: array[i].author, likes: array[i].likes })
		}
	}
	return authors.length > 0 ? authors.sort((a,b) => b.likes - a.likes)[0] : {}
}


module.exports = {
	palindrome,
	average,
	totallikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}