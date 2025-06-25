const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    collection: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'cardCollection', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
    }
});