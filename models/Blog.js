const mongoose = require('mongoose')
const AutoInctrement = require('mongoose-sequence')(mongoose)

const blogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
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

blogSchema.plugin(AutoInctrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Blog', blogSchema)