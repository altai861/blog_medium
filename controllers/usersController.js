const User = require('../models/User')
const Blog = require('../models/Blog')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
// @route GET /users
// @success Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

//@desc create a new user
// @route POST /users
// @success Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body
    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate username' })
    }

    //hash the password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    const userObject = { username, "password": hashedPwd, roles }

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

//@desc Update user
// @route PATCH /users
// @success Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // hash password
        user.password = await bcrypt.hash(password, 10) //salt rounds

    }
    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated` })
})

//@desc Delete user
// @route DELETE /users
// @success Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const blogs = await Blog.findOne({ user: id }).lean().exec()
    if (blogs?.length) {
        for (let i = 0; i < blogs.length; i++) {
            const deletedBlog = await blogs[i].deleteOne()
        }
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted. Also his blogs are deleted.`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}