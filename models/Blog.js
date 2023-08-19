const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        cover: {
            type: String,
        },
        content: {
            type: Object,
        },
        published: {
            type: Boolean,
            required: true,
        },
        type: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
)



module.exports = mongoose.model('Blog', blogSchema)