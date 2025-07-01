const mongoose = require('mongoose');
const cardSchema = require('./card.js');
const commentSchema = require('./comment.js')

const cardCollectionSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    collectionName: {
        type: String,
        required: true
    },
    cards: [cardSchema],
    comments: [commentSchema]
});

const cardCollection = mongoose.model('cardCollection', cardCollectionSchema);
module.exports = cardCollection;