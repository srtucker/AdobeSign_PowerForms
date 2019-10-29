const { Workflow } = require('./Workflow');
const { DynamicForm } = require('./DynamicForm');
const app = require('./app');
const queryString = require('query-string');

require('../css/stylesheet.css');

const qs = queryString.parse(location.search);
if (qs.workflowId) {
  console.log("test");

  // Get workflow ID
  var workflow_id = qs.workflowId;

  // Fetch workflow data by ID
  var workflow_data = fetch('api/getWorkflowById/' + workflow_id)
      .then(function (resp) {
          return resp.json()
      })
      .then(function (data) {
          return data;
      });

  // Fetch application features
  var get_features = fetch('features')
      .then(function (resp) {
          return resp.json()
      })
      .then(function (data) {
          return data;
      });

  // Create new workflow object for API calls
  var workflow_agreement_data = new Workflow(workflow_id);

  // Grab the parent div from the dynamic form
  var parent_form_div = document.getElementById("recipient_form");

  // Create the dynamic form
  var dynamic_form = new DynamicForm(
      parent_form_div, workflow_data, workflow_agreement_data, get_features);
  dynamic_form.buildRecipientsForm();

  app.showHiddenDiv();
}
