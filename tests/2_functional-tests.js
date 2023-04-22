const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let idToDeleteLater;
chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('Routing tests', () => {
        suite('POST request tests', () => {
            //Create an issue with every field: POST request to /api/issues/{project}
            test('Create an issue with every field', done => {
                chai
                .request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/json')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Lorem ipsum dolar',
                    created_by: 'CalicoSquid',
                    assigned_to: 'Professor X',
                    status_text: 'New issue'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    idToDeleteLater = res.body._id;
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'Lorem ipsum dolar');
                    assert.equal(res.body.created_by, 'CalicoSquid');
                    assert.equal(res.body.assigned_to, 'Professor X');
                    assert.equal(res.body.status_text, 'New issue');
                    done();
                })
            })
            //Create an issue with only required fields: POST request to /api/issues/{project}
            test('Create an issue with only required fields', done => {
                chai
                .request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/json')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Lorem ipsum dolar',
                    created_by: 'CalicoSquid',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'Lorem ipsum dolar');
                    assert.equal(res.body.created_by, 'CalicoSquid');
                    done();
                })
            })
            //Create an issue with missing required fields: POST request to /api/issues/{project}
            test('Create an issue with missing required fields', done => {
                chai
                .request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/json')
                .send({
                    issue_title: '',
                    issue_text: '',
                    created_by: 'CalicoSquid',
                    assigned_to: '',
                    status_text: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                })
            })
        })

        suite('GET request tests', () => {
            //View issues on a project: GET request to /api/issues/{project}
            test('View issues on a project', done => {
                chai
                .request(server)
                .get('/api/issues/test-projects')  
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 0);
                    done();
                })
            })
            //View issues on a project with one filter: GET request to /api/issues/{project}
            test('View issues on a project with one filter', done => {
                chai
                .request(server)
                .get('/api/issues/apitest')  
                .query({_id: '6444474c7c385473eb464d14'})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        _id: '6444474c7c385473eb464d14',
                        name: 'apitest',
                        issue_title: 'Test Post',
                        issue_text: 'This is a test',
                        created_on: '2023-04-22T20:45:00.362Z',
                        updated_on: '2023-04-22T20:45:00.362Z',
                        created_by: 'Testbot 3000',
                        assigned_to: 'CalicoSquid',
                        open: true,
                        status_text: 'Just a test',
                        __v: 0
                    });
                    done();
                })
            })
            //View issues on a project with multiple filters: GET request to /api/issues/{project}
            test('View issues on a project with multiple filters', done => {
                chai
                .request(server)
                .get('/api/issues/apitest')  
                .query({
                    issue_title: 'Test Post',
                    issue_text: 'This is a test'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        _id: '6444474c7c385473eb464d14',
                        name: 'apitest',
                        issue_title: 'Test Post',
                        issue_text: 'This is a test',
                        created_on: '2023-04-22T20:45:00.362Z',
                        updated_on: '2023-04-22T20:45:00.362Z',
                        created_by: 'Testbot 3000',
                        assigned_to: 'CalicoSquid',
                        open: true,
                        status_text: 'Just a test',
                        __v: 0
                    });
                    done();
                })
            })
        })

        suite('PUT request tests', () => {
            //Update one field on an issue: PUT request to /api/issues/{project}
            test('Update one field on an issue', done => {
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '64444a9b6045d46e458d15da',
                    issue_title: 'Change title'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, '64444a9b6045d46e458d15da');
                })
                done();
            })
            //Update multiple fields on an issue: PUT request to /api/issues/{project}
            test('Update multiple fields on an issue', done => {
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '64444a9b6045d46e458d15da',
                    issue_title: 'Change title',
                    issue_text: 'New text',
                    created_by: 'Testbot 4000'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, '64444a9b6045d46e458d15da');
                })
                done();
            })
            //Update an issue with missing _id: PUT request to /api/issues/{project}
            test('Update an issue with missing _id', done => {
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    issue_title: 'Change title'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    assert.equal(res.body._id, undefined);
                })
                done();
            })
            //Update an issue with no fields to update: PUT request to /api/issues/{project}
            test('Update an issue with no fields to update', done => {
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '64444a9b6045d46e458d15da',
                    issue_title: '',
                    issue_text: '',
                    created_by: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'no update field(s) sent');
                    assert.equal(res.body._id, '64444a9b6045d46e458d15da');
                })
                done();
            })
            //Update an issue with an invalid _id: PUT request to /api/issues/{project}
            test('Update an issue with an invalid _id', done => {
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '64444a9b6045d46e458d15daTerribleID',
                    issue_title: 'Change title',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not update');
                    assert.equal(res.body._id, '64444a9b6045d46e458d15daTerribleID');
                })
                done();
            })
        })

        suite('DELETE request tests', () => {
            //Delete an issue: DELETE request to /api/issues/{project}
            test('Delete an issue', done => {
                chai
                .request(server)
                .delete('/api/issues/project')
                .send({ _id: idToDeleteLater })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, idToDeleteLater)
                })
                done();
            })
            //Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
            test('Delete an issue with an invalid _id', done => {
                chai
                .request(server)
                .delete('/api/issues/project')
                .send({ _id: 'invalidId' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body._id, 'invalidId')                 
                })
                done();
                
            })
            //Delete an issue with missing _id: DELETE request to /api/issues/{project}
            test('Delete an issue with missing _id', done => {
                chai
                .request(server)
                .delete('/api/issues/project')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    assert.equal(res.body._id, undefined)
                })
                done();
            })
        })
    })
});
