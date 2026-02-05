const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
    law: {
        type: String,
        required: true
    },

    proposedBy: {
        type: String,
        required: true,
    },
});

const Law = mongoose.model("Law", lawSchema);

module.exports = Law;