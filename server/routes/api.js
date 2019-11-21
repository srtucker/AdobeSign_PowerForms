//include modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer  = require('multer');
const Axios = require('axios');
const FormData = require('form-data');
const WorkflowConfig = require('../WorkflowConfig.js');
const WorkflowAgreementProcessor = require('../WorkflowAgreementProcessor.js');
const config = require('../../config');

const fetch = require('node-fetch');

/*Axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})*/

//create router and export it
var router = express.Router();
module.exports = router;

//add helpers
const upload = multer({
  dest: path.join(__dirname, '../../temp/uploads/'),
});
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
    const workflowId = req.params.workflowId;
    const api_response = await APIClient.get(`/workflows/${workflowId}`);
    let workflowConfig = new WorkflowConfig(api_response.data, config.WorkFlowConfig);
    res.json(workflowConfig.getClientConfig());
  }
  catch(e) {
    if(e.response) {
      console.error(`API Error: ${e.response.status}`, e.response);
      if(e.response.status == 401) {
        return res.status(500).send();
      }
      else if(e.response.status == 403) {
        return res.status(403).json(e.response.data);
      }
      else if(e.response.status == 404) {
        return res.status(404).json(e.response.data);
      }
    }

    console.error(e);
    res.status(500).send();
  }
});

router.post('/workflows/:workflowId/agreements', async function(req, res, next){
  try {
    const workflowId = req.params.workflowId;
    const wfDataRequest = await APIClient.get(`/workflows/${workflowId}`);
    let worflowProcessor = new WorkflowAgreementProcessor(wfDataRequest.data, config.WorkFlowConfig, req.body);

    let agreementData = worflowProcessor.getAgreement();
    let sendingAccount = worflowProcessor.getSendingAccount();
    let headers = {};

    if(sendingAccount) {
      headers["x-api-user"] = `email:${sendingAccount}`;
    }

    const agreementRequest = await APIClient.post(`/workflows/${workflowId}/agreements`, agreementData, {headers});

    console.log("agreementRequest", agreementRequest);
    res.json(agreementRequest.data);
  }
  catch(e) {
    if(e.response) {
      console.error(`API Error: ${e.response.status}`, e.response);
      if(e.response.status == 403) {
        return res.status(403).json(e.response.data);
      }
      else if(e.response.status == 404) {
        return res.status(404).json(e.response.data);
      }
    }

    console.error(e);
    res.status(500).send();
  }
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
