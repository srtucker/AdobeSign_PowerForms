//include modules
const express = require('express');
const fs = require('fs');
const multer  = require('multer');
const Axios = require('axios');
const FormData = require('form-data');
const WorkflowConfig = require('../WorkflowConfig.js');
const WorkflowAgreementProcessor = require('../WorkflowAgreementProcessor.js');
const config = require('../config.js');

const fetch = require('node-fetch');

/*Axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})*/

//create router and export it
var router = express.Router();
module.exports = router;

//add helpers
const upload = multer({ dest: 'temp/uploads/' });
const APIClient = Axios.create({
  baseURL: config.adobeApi.url,
  headers: {
    'Access-Token': config.adobeApi.integrationKey
  }
});


// GET /workflows
router.get('/getWorkflows', async function (req, res, next) {
  const config = req.app.locals.config;

  function getWorkflows() {
    /***
     * This function makes a request to get workflows
     */
    return fetch(config.adobeApi.url + '/workflows', {
      method: 'GET',
      headers: {
        'Access-Token': config.adobeApi.integrationKey
      }
    });
  }

  const workflow_list = await getWorkflows();
  const data = await workflow_list.json();

  res.json(data['userWorkflowList']);
});

// GET /workflows/{workflowId}
router.get('/workflows/:workflowId', async function(req, res, next){
  try {
    const api_response = await APIClient.get("/workflows/" + req.params.workflowId);
    var workflowConfig = new WorkflowConfig(api_response.data, config.WorkFlowConfig);

    res.json(workflowConfig.getClientConfig());
  }
  catch(err) {
    console.error(err);
    if(err.response) {
      console.error(err.response);
      if(err.response.status == 404) {
        res.status(404).json(err.response.data);
        return;
      }
    }
    res.status(500).send();
  }
});

router.post('/workflows/:workflowId/agreements', async function(req, res, next){
  try {
    const workflowId = req.params.workflowId;
    const wfDataRequest = await APIClient.get("/workflows/"+workflowId);

    console.log("req.body", req.body);

    let worflowProcessor = new WorkflowAgreementProcessor(wfDataRequest.data, config.WorkFlowConfig, req.body);

    let agreementData = worflowProcessor.getAgreement();
    let sendingAccount = worflowProcessor.getSendingAccount();

    let headers = {};

    if(sendingAccount) {
      headers['x-api-user'] = "email:"+sendingAccount
    }

    const agreementRequest = await APIClient.post("/workflows/"+workflowId+"/agreements", agreementData, {headers});

    console.log("agreementRequest", agreementRequest);



    //console.log("agreement", agreement);



    res.json();
  }
  catch(err) {
    console.error(err);
    if(err.response) {
      console.error(err.response);
      if(err.response.status == 404) {
        res.status(404).json(err.response.data);
        return;
      }
    }
    res.status(500).send();
  }

  /*

  try {

    const api_response = await Axios.get(config.adobeApi.url + "/workflows/" + req.params.workflowId, {
      headers: {
        'Access-Token': config.adobeApi.integrationKey
      }
    });

    var workflowConfig = new WorkflowConfig(api_response.data, config.features);

    res.json(workflowConfig.getClientConfig());
  }
  catch(err) {
    console.error(err);
    if(err.response) {
      console.error(err.response);
      if(err.response.status == 404) {
        res.status(404).json(err.response.data);
        return;
      }
    }
    res.status(500).send();
  }*/
});

// GET /libraryDocuments/{libraryDocumentId}/documents
router.get('/getLibraryDocuments/:id', async function(req, res, next) {
  const config = req.app.locals.config;

  function getLibraryDocuments() {
    /***
     * This function gets library documents by ID
     */
    return fetch(config.adobeApi.url + "/libraryDocuments/" + req.params.id + "/documents", {
      method: 'GET',
      headers: {
        'Access-Token': config.adobeApi.integrationKey
      }
    });
  }

  const library_document = await getLibraryDocuments();
  const data = await library_document.json();

  es.json(data);
});

// POST /workflows/{workflowId}/agreements
router.post('/postAgreement/:id', async function(req, res, next){
  const config = req.app.locals.config;

  function postAgreement() {
    /***
     * This function post agreements
     */
    return fetch(config.adobeApi.url + "/workflows/" + req.params.id + "/agreements", {
      method:'POST',
      headers: {
        'Access-Token': config.adobeApi.integrationKey,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
  }

  const api_response = await postAgreement();
  const data = await api_response.json();

  res.json(data);
});

// POST /transientDocuments
router.post('/postTransient', upload.single('myfile'), async function (req, res, next) {
  try {
    // Create FormData
    var formData = new FormData();
    formData.append('File-Name', req.file.originalname);
    formData.append('Mime-Type', req.file.mimetype);
    formData.append('File', fs.createReadStream(req.file.path));

    //make request
    const api_response = await APIClient.post("/transientDocuments", formData, {
      headers: {
        'Content-Type': `multipart/form-data;boundary=${formData.getBoundary()}`
      }
    });

    // Delete uploaded doc after transient call
    fs.unlink(req.file.path, function (err) {
      if (err) return console.log(err);
    });

    res.json(api_response.data)
  }
  catch(err) {
    console.error(err);
    if(err.response) {
      console.error(err.response);
      if(err.response.status == 404) {
        res.status(404).json(err.response.data);
        return;
      }
    }
    res.status(500).send();
  }
});
