import "core-js/stable";
import "regenerator-runtime/runtime";
import Axios from 'axios';
import Workflow from './Workflow';
import DynamicForm from './DynamicForm';
import ParsePath from './util/ParsePath';
import { HandledException } from './util/Exceptions';
import DOMUtils from './util/DOMUtils';

import appErrorTemplate from 'AppError.hbs';

import '../scss/style.scss';

const parsePath = new ParsePath({
  sensitive: false,
  strict: false,
  end: true,
});

let initialLoadingNode = document.getElementById('initial-loading');
let appNode = document.getElementById("app");

var params = parsePath.test(`${ClientConfig.baseURL}/${ClientConfig.workflowPath}/:id`.replace(/[\/]+/g, '/'), window.location.pathname);
if(params !== false) {
  var workflowId = params.id;
  runWorkflow(appNode, workflowId, false);
}
else {
  appNode.innerHTML = appErrorTemplate({
    heading: "Error",
    errorBody: "The page you have requested is invalid.",
  });
  DOMUtils.removeElement(initialLoadingNode);
  //showWorkflowSelector()
}

async function showWorkflowSelector() {
  $("#workflow_selector").show();

  try {
    const api_response = await Axios.get(ClientConfig.apiBaseURL + 'api/getWorkflows');
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
    DOMUtils.removeElement(initialLoadingNode);

    $('#workflow_selector #option_submit_button').click(() => {
      var workflowId = $("#workflow_dropdown").val();
      runWorkflow(workflowId, true);
    });
  }
  catch (err) {
    console.error(err);
  }
}

async function runWorkflow(appNode, workflowId, showSelector) {
  try {
    let workflow = await Workflow.loadWorkflow(workflowId);

    // Create the dynamic form
    workflow.render(appNode, true);
    DOMUtils.removeElement(initialLoadingNode);
  }
  catch(e) {
    DOMUtils.removeElement(initialLoadingNode);

    if(e instanceof HandledException) {
      appNode.innerHTML = appErrorTemplate(e.getTemplateVars());
    }
    else {
      console.error(e);
    }
  }
}
