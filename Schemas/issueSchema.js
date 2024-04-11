const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        issue_title: {
            type: String,
            required: true,
        },
        issue_text: {
            type: String,
            required: true,
        },
        created_by: {
            type: String,
            required: true,
        },
        assigned_to: String,
        open: {
            type: Boolean,
            default: true,
        },
        status_text: String,
        project_name: String,
    },
    {
        timestamps: { createdAt: "created_on", updatedAt: "updated_on" },
    }
);

module.exports = mongoose.model("Issue", issueSchema);
