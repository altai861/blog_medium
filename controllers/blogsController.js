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


const getSingleBlog = asyncHandler(async (req, res) => {
    const id = req.params.blog_id
    const blog = await Blog.findById(id).exec();
    if (!blog) {
        return res.status(400).json({ message: "Blog not found" })
    }

    return res.json(blog)
})

const deleteSingleBlog = asyncHandler(async (req, res) => {
    const id = req.params.blog_id
    const blog = await Blog.findById(id).exec();
    const result = await blog.deleteOne();
    const reply = `${result._id} deleted`

    res.json(reply)
})

//@desc Create a new blog
// @route POST /blogs
// @success Private
const createNewBlog = asyncHandler(async (req, res) => {
    const content = {
        "time": new Date().getTime(),
        "blocks": [
          {
            "type": "header",
            "data": {
              "text": "This is my awesome editor!",
              "level": 1
            }
          },
        ]
      }
    const blog = await Blog.create({ content: content, published: false })
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
    const { id, content, published, title, cover, type} = req.body

    if (!id || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const blog = await Blog.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    blog.content = content
    if (published) {
        if (!title || !cover || !type) {
            return res.status(401).json({ message: 'To publish blog post, you have to have title and cover page' });
        }
        blog.published = published
        blog.title = title
        blog.cover = cover
        blog.type = type
    } else {
        blog.published = published
        blog.cover = cover
        blog.title = title
        blog.type = type
    }
    blog.title = title
    blog.cover = cover
    blog.type = type
    const updatedBlog = await blog.save()

    res.json(`${updatedBlog._id} updated`)
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

    const reply = `${result._id} deleted`

    res.json(reply)
})



module.exports = {
    getAllBlogs,
    createNewBlog,
    updateBlog,
    deleteBlog,
    getSingleBlog,
    deleteSingleBlog
}






