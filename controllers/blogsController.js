const User = require('../models/User')
const Blog = require('../models/Blog')
const asyncHandler = require('express-async-handler')


//@desc Get all blogs
// @route GET /blogs
// @success Private
const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().lean()
    if (!blogs?.length) {
        return res.status(200).json({ message: 'No article found' })
    }
    // Add username to each blog before sending the response
    res.json(blogs);
})

//@desc Create a new blog
// @route POST /blogs
// @success Private
const createNewBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.create({ published: false })
    console.log(blog._id)
    const blog_id = blog._id;
    if (blog) {
        return res.status(201).json({ message: 'New blog created', blog_id})
    } else {
        return res.status(400).json({ message: 'Invalid blog data received' })
    }
    
})

//@desc update blog
// @route PATCH /blogs
// @success Private
const updateBlog = asyncHandler(async (req, res) => {
    const { id, title, cover, content} = req.body

    if (!id || !title || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const blog = await Blog.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    blog.content = content
    blog.title = title
    if (cover) {
        blog.cover = cover
    }

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




