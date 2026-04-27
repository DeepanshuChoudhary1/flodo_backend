const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({

    location: {
        latitude: {
            type: String,
            required: true,
        },
        longitude: {
            type: String,
            required: true,
        },
    },

}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);