
import "core-js";
import "regenerator-runtime/runtime";
import queryString from 'query-string';
import Axios from 'axios';

import Workflow from './Workflow';
import DynamicForm from './DynamicForm';
import ParsePath from './ParsePath';
//const app = require('./app');

import '../scss/style.scss';

const parsePath = new ParsePath({
  sensitive: false,
  strict: false,
  end: true,
});

$("#workflow_selector").hide();
$("#workflow_name").hide();

var params = parsePath.test('/workflow/:id', window.location.pathname);
if(params !== false) {
  var workflowId = params.id;
  runWorkflow(workflowId, false);
}
else {
  showWorkflowSelector()
}

async function showWorkflowSelector() {
  $("#workflow_selector").show();

  try {
    const api_response = await Axios.get(apiBaseURL + 'api/getWorkflows');
    const workflow_list = api_response.data;

    // Iterate through workflow data and assign text/value to array for drop-down options
    for (let i = 0; i < workflow_list.length; i++) {
        workflow_list[i].text = workflow_list[i].displayName;
        workflow_list[i].value = workflow_list[i].workflowId;
        delete workflow_list[i].displayName;
        delete workflow_list[i].workflowId;
    }

    // Add elements from options array into the drop down menu
    const selectBox = document.getElementById('workflow_dropdown');
    for (let j = 0, l = workflow_list.length; j < l; j++) {
        const option = workflow_list[j];
        selectBox.options.add(new Option(option.text, option.value, option.selected));
    }

    $('#workflow_selector #option_submit_button').click(() => {
      var workflowId = $("#workflow_dropdown").val();
      runWorkflow(workflowId, true);
    });
  }
  catch (err) {
    console.error(err);
  }
}

async function runWorkflow(workflowId, showSelector) {
  // Fetch workflow data by ID
  const workflowReq = Axios.get(apiBaseURL + 'api/getWorkflowById/' + workflowId);

  // Fetch application features
  const featuresReq = Axios.get(apiBaseURL + 'features');

  let workflow_data = (await workflowReq).data;
  let get_features = (await featuresReq).data;


  // Create new workflow object for API calls
  let workflow_agreement_data = new Workflow(workflowId);

  if(!showSelector) {
    $("#workflow_name").html('<h1>'+workflow_data.displayName+'</h1>').show();
  }

  // Grab the parent div from the dynamic form
  var parent_form_div = document.getElementById("recipient_form");

  // Create the dynamic form
  var dynamic_form = new DynamicForm(parent_form_div, workflow_data, workflow_agreement_data, get_features);
  dynamic_form.buildRecipientsForm();

  showHiddenDiv();
}

function showHiddenDiv(){
  /**
   * This function will show all hidden divs when workflow is selected
   */

  var hidden_class = document.getElementsByClassName('form_hidden');

  for (let i = 0; i < hidden_class.length; i++) {
    hidden_class[i].style.display = 'block';
  }
}
