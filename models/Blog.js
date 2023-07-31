const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true
    }
)



module.exports = mongoose.model('Blog', blogSchema)