const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },

    description: { type: String },
    dueDate: { type: Date, required: true, index: true },

    status: {
        type: String,
        enum: ["To-Do", "In Progress", "Done"],
        default: "To-Do",
        index: true,
    },

    blockedBy: {
        title: {
            type: String,
            default: null,
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        }
    },

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);