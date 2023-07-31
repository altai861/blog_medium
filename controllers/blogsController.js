const User = require('../models/User')
const Blog = require('../models/Blog')
const asyncHandler = require('express-async-handler')


//@desc Get all blogs
// @route GET /blogs
// @success Private
const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().lean()
    if (!blogs?.length) {
        return res.status(400).json({ message: 'No article found' })
    }

    // Add username to each blog before sending the response
    const blogsWithUser = await Promise.all(blogs.map(async (blog) => {
        const user = await User.findById(blog.user).lean().exec()
        return { ...blog, username: user.username }
    }))

    res.json(blogsWithUser)
})

//@desc Create a new blog
// @route POST /blogs
// @success Private
const createNewBlog = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const the_user = User.findById(user).exec()

    if (the_user) {
        console.log("user found")
        
        const blog = await Blog.create({ user, title, text })

        if (blog) {
            return res.status(201).json({ message: 'New blog created' })
        } else {
            return res.status(400).json({ message: 'Invalid blog data received' })
        }
    } else {
        return res.status(400).json({ message: "Invalid user" })
    }

    
    
})

//@desc update blog
// @route PATCH /blogs
// @success Private
const updateBlog = asyncHandler(async (req, res) => {
    const { id, user, title, text } = req.body

    if (!id || !user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const blog = await Blog.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    blog.user = user
    blog.title = title
    blog.text = text

    const updatedBlog = await blog.save()

    res.json(`${updatedBlog.title} updated`)
})


//@desc delete blog
// @route DELETE /blogs
// @success Private
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: "Blog ID required" })
    }

    const blog = await Blog.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    const result = await blog.deleteOne()

    const reply = `Blog ${result.title} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllBlogs,
    createNewBlog,
    updateBlog,
    deleteBlog
}




