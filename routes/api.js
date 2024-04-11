"use strict";

const mongoose = require("mongoose");
const Issue = require("../Schemas/issueSchema.js");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = function (app) {
    app.route("/api/issues/:project")

        .get(async function (req, res) {
            const project = req.params.project;
            const issues = await Issue.find(
                Object.assign(req.query, { project_name: project })
            );
            res.json(
                issues.map((item) => {
                    let issueRes = {};
                    for (let key in item._doc) {
                        console.log(key);
                        if (key !== "__v" && key !== "project_name") {
                            issueRes[key] = item[key];
                        }
                    }
                    return issueRes;
                })
            );
        })

        .post(async function (req, res) {
            const project = req.params.project;

            try {
                const issue = await Issue.create({
                    issue_title: req.body.issue_title,
                    issue_text: req.body.issue_text,
                    created_by: req.body.created_by,
                    assigned_to: req.body.assigned_to || "",
                    status_text: req.body.status_text || "",
                    project_name: project,
                });

                let issueRes = {};

                for (let key in issue._doc) {
                    if (key !== "__v" && key !== "project_name") {
                        issueRes[key] = issue[key];
                    }
                }

                res.json(issueRes);
            } catch (err) {
                res.json({ error: "required field(s) missing" });
            }
        })

        .put(async function (req, res) {
            const project = req.params.project;

            if (!req.body._id) {
                res.json({ error: "missing _id" });
                return;
            }

            let isEmpty = true;

            for (let key in req.body) {
                if (req.body[key] && key !== "_id") {
                    isEmpty = false;
                }
            }

            if (isEmpty) {
                res.json({
                    error: "no update field(s) sent",
                    _id: req.body._id,
                });
                return;
            }

            try {
                const issue = await Issue.findById(req.body._id);
                await Issue.findByIdAndUpdate(
                    req.body._id,
                    {
                        issue_title: req.body.issue_title || issue.issue_title,
                        issue_text: req.body.issue_text || issue.issue_text,
                        created_by: req.body.created_by || issue.created_by,
                        assigned_to: req.body.assigned_to || issue.assigned_to,
                        status_text: req.body.status_text || issue.status_text,
                        open: req.body.open ? false : issue.open,
                    },
                    {
                        runValidators: true,
                    }
                );
                res.json({ result: "successfully updated", _id: req.body._id });
            } catch (err) {
                res.json({ error: "could not update", _id: req.body._id });
            }
        })

        .delete(async function (req, res) {
            const project = req.params.project;

            if (!req.body._id) {
                res.json({ error: "missing _id" });
                return;
            }

            try {
                const issue = await Issue.findByIdAndDelete(req.body._id);
                if (!issue) {
                    throw new Error();
                }
                res.json({ result: "successfully deleted", _id: req.body._id });
            } catch (err) {
                res.json({ error: "could not delete", _id: req.body._id });
            }
        });
};
