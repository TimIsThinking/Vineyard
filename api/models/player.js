const mongoose = require('mongoose');

const Player = mongoose.model('Player', { 
    name: {
        type: String,
        required: true
    },
    guid: {
        type: String,
        required: true,
        unique: true
    },
    kills: {
        type: Number,
        default: 0
    },
    deaths: {
        type: Number,
        default: 0
    }
});

module.exports = Player