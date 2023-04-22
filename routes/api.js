'use strict';
// Define necessary variables
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create new Schema for issues

const NewIssueSchema = new Schema({
  name: {type: String, required: true},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_on: Date,
  updated_on: Date,
  created_by: {type: String, required: true},
  assigned_to: String,
  open: Boolean,
  status_text: String
})
// And assign it to a variable 
const NewIssue = mongoose.model("NewIssue", NewIssueSchema);
// Create the project schema

module.exports = function (app) {

  app.route('/api/issues/:project')
  // Get request
  .get(function (req, res){
    let project = req.params.project;
    let query = req.query;
    let queryObj = { name: project, ...query}
    let returnArr = []
    // Find document by project name or any other query's added on
    NewIssue
    .find(queryObj)
    .then(data => {
        // Iterate through array of data and push to array
        data.map(item => returnArr.push(item))
        // Then return JSON response
        return res.send(returnArr);
    })
    // Check for errors
    .catch(err => {
      if (err) {
        return res.json({ error: 'Error' });
      }
    });        
  })
    // POST request
    .post(function (req, res){
      let project = req.params.project;
      let title = req.body.issue_title;
      let text = req.body.issue_text;
      let createdBy = req.body.created_by;
      let assign = req.body.assigned_to;
      let status = req.body.status_text;
      // Make sure required fields have been filled in
      if (!title || !text || !createdBy) {
        return res.json({ error: 'required field(s) missing' });
      }
      // Create new document
      const newIssue = new NewIssue({
        name: 'test',
        issue_title: title,
        issue_text: text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: createdBy,
        assigned_to: assign || '',
        open: true,
        status_text: status || ''
      })
      // Save it
      newIssue
      .save()
      .then(data => {
        // If no errors return JSON object
        return res.json(data)
      })
      // Check for errors
      .catch(err => {
        if (err) {
          return res.json({ error: 'Error'});
        }
      });            
    })
    // Update form
    .put(function (req, res){
      let _id = req.body._id;
      let title = req.body.issue_title;
      let text = req.body.issue_text;
      let createdBy = req.body.created_by;
      let assign = req.body.assigned_to;
      let statusText = req.body.status_text;
      // If no ID filled in return error
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      // Make sure at least one field has been filled in or return error
      if (!title && !text && !createdBy && !assign && !statusText) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      } 
      // Set the current time for update
      let now = new Date();
      let updates = {...req.body, updated_on: now}
      // Make sure to delete id from update obj so that we dont have a duplicate
      delete updates._id;
      // Update data
      NewIssue.updateOne({ _id: _id }, updates)
      .then(data => {
        // Make sure the id is from a valid document and send either a success or error message
        return data.matchedCount == 1 ?
          res.json({  result: 'successfully updated', '_id': _id }) :
          res.json({ error: 'could not update', '_id': _id })  
      })
      // Check for errors
      .catch(err => {
        console.log('error')
        if (err) {
          return res.json({ error: 'could not update', '_id': _id });
        }
      });        
    })
    // Delete document
    .delete(function (req, res){
      let _id = req.body._id;
      // Return error if no id entered
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      // Find and delete document
      NewIssue.findOneAndDelete({_id: _id})
      .then(data => {
        return data ?
          res.json({result: 'successfully deleted', '_id': _id}):
          res.json({ error: 'could not delete', '_id': _id });
      // And check for errors...  
      }).catch(err => {
        if (err) {
          return res.json({ error: 'could not delete', '_id': _id });
        }
      }) 
    });
};
