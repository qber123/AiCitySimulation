const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    lawId: {
        type: String,
        required: true,
    },
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;