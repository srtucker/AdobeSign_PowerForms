import Axios from 'axios';

export async function getWorflowConfig(workflowId) {
  const workflowReq = Axios.get(ClientConfig.apiBaseURL + 'api/workflows/' + workflowId);

  let workflowConfig = (await workflowReq).data;

  return workflowConfig
}

export async function postTransientDocument(file) {
  var formData = new FormData();
  formData.append('myfile', file);

  const apiResponse = Axios.post(ClientConfig.apiBaseURL + 'api/postTransient', formData);

  let data = (await apiResponse).data;

  return data;
}


export async function postWorkflowAgreement(workflowId, agreementData) {
  //var formData = new FormData();
  //formData.append('myfile', file);

  const apiResponse = Axios.post(ClientConfig.apiBaseURL + 'api/workflows/'+workflowId+'/agreements', agreementData, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  });

  let data = (await apiResponse).data;
  console.log("apiResponse.data", data)

  return data;
}
