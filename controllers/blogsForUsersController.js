const Blog = require('../models/Blog')
const asyncHandler = require('express-async-handler')


const getAllUsersBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().lean()

    if (!blogs?.length) {
        return res.status(200).json({ message: 'No article found' })
    }

    const published_blogs = blogs.filter(blog => blog.published);

    res.json(published_blogs);
})

const getSingleUsersBlogs = asyncHandler(async (req, res) => {
    const id = req.params.blog_id
    const blog = await Blog.findById(id).exec();
    if (!blog || !blog.published) {
        return res.status(400).json({ message: "Blog not found" })
    }

    return res.json(blog)
})

module.exports = {
    getAllUsersBlogs,
    getSingleUsersBlogs
}