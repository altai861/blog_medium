const express = require('express')
const router = express.Router()
const blogsForUsersController = require('../controllers/blogsForUsersController')

router.route('/')
    .get(blogsForUsersController.getAllUsersBlogs)

router.route('/:blog_id')
    .get(blogsForUsersController.getSingleUsersBlogs)

module.exports = router