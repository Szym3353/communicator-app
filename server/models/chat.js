const {model,Schema} = require('mongoose')

const chatSchema = new Schema({
    users: [String],
    usersDetails: [{id: String, username: String, avatarURL: String}],
    messages: [{
        author: String,
        date: String,
        content: String,
        read: [String]
    }]
}, {collection: 'chats'})

module.exports = model('Chat', chatSchema)