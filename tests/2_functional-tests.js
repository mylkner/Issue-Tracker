const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const expect = chai.expect;
chai.use(chaiHttp);

suite("Functional Tests", function () {
    let testId;

    test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .post("/api/issues/test")
            .send({
                issue_title: "test",
                issue_text: "test",
                created_by: "test",
                assigned_to: "test",
                status_text: "test",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body)
                    .to.have.property("issue_title")
                    .to.equal("test");
                expect(res.body)
                    .to.have.property("issue_text")
                    .to.equal("test");
                expect(res.body)
                    .to.have.property("created_by")
                    .to.equal("test");
                expect(res.body)
                    .to.have.property("assigned_to")
                    .to.equal("test");
                expect(res.body)
                    .to.have.property("status_text")
                    .to.equal("test");
                expect(res.body).to.have.property("created_on");
                expect(res.body).to.have.property("updated_on");
                expect(res.body)
                    .to.have.property("open")
                    .to.be.a("boolean")
                    .to.equal(true);
                done();
            });
    });
    test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .post("/api/issues/test")
            .send({
                issue_title: "test1",
                issue_text: "test2",
                created_by: "test3",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body)
                    .to.have.property("issue_title")
                    .to.equal("test1");
                expect(res.body)
                    .to.have.property("issue_text")
                    .to.equal("test2");
                expect(res.body)
                    .to.have.property("created_by")
                    .to.equal("test3");
                expect(res.body).to.have.property("assigned_to").to.equal("");
                expect(res.body).to.have.property("status_text").to.equal("");
                expect(res.body).to.have.property("created_on");
                expect(res.body).to.have.property("updated_on");
                expect(res.body)
                    .to.have.property("open")
                    .to.be.a("boolean")
                    .to.equal(true);
                testId = res.body._id;
                done();
            });
    });
    test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .post("/api/issues/test")
            .send({
                issue_title: "test",
                issue_text: "test",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "required field(s) missing",
                });
                done();
            });
    });
    test("View issues on a project: GET request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/test")
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).is.a("array");
                expect(res.body[0]).to.have.property("issue_title");
                expect(res.body[0]).to.have.property("issue_text");
                expect(res.body[0]).to.have.property("created_by");
                expect(res.body[0]).to.have.property("assigned_to");
                expect(res.body[0]).to.have.property("status_text");
                expect(res.body[0]).to.have.property("created_on");
                expect(res.body[0]).to.have.property("updated_on");
                expect(res.body[0]).to.have.property("open");
                done();
            });
    });
    test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/test")
            .query({ issue_title: "test1" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).is.a("array");
                expect(res.body[0])
                    .to.have.property("issue_title")
                    .to.equal("test1");
                expect(res.body[0]).to.have.property("issue_text");
                expect(res.body[0]).to.have.property("created_by");
                expect(res.body[0]).to.have.property("assigned_to");
                expect(res.body[0]).to.have.property("status_text");
                expect(res.body[0]).to.have.property("created_on");
                expect(res.body[0]).to.have.property("updated_on");
                expect(res.body[0]).to.have.property("open");
                done();
            });
    });
    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/test")
            .query({
                issue_title: "test1",
                issue_text: "test2",
                created_by: "test3",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).is.a("array");
                expect(res.body[0])
                    .to.have.property("issue_title")
                    .to.equal("test1");
                expect(res.body[0])
                    .to.have.property("issue_text")
                    .to.equal("test2");
                expect(res.body[0])
                    .to.have.property("created_by")
                    .to.equal("test3");
                expect(res.body[0]).to.have.property("assigned_to");
                expect(res.body[0]).to.have.property("status_text");
                expect(res.body[0]).to.have.property("created_on");
                expect(res.body[0]).to.have.property("updated_on");
                expect(res.body[0]).to.have.property("open");
                done();
            });
    });
    test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/test")
            .send({ _id: testId, issue_text: "update2", created_by: "update3" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    result: "successfully updated",
                    _id: testId,
                });
                done();
            });
    });
    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/test")
            .send({ _id: testId, issue_title: "update1" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    result: "successfully updated",
                    _id: testId,
                });
                done();
            });
    });
    test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/test")
            .send({ _id: "" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "missing _id",
                });
                done();
            });
    });
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/test")
            .send({ _id: testId })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "no update field(s) sent",
                    _id: testId,
                });
                done();
            });
    });
    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/test")
            .send({ _id: "invalid_id", issue_title: "invalid_test" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "could not update",
                    _id: "invalid_id",
                });
                done();
            });
    });
    test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .delete("/api/issues/test")
            .send({ _id: testId })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    result: "successfully deleted",
                    _id: testId,
                });
                done();
            });
    });
    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .delete("/api/issues/test")
            .send({ _id: "invalid_id" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "could not delete",
                    _id: "invalid_id",
                });
                done();
            });
    });
    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
        chai.request(server)
            .keepOpen()
            .delete("/api/issues/test")
            .send({ _id: "" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "missing _id",
                });
                done();
            });
    });
});
