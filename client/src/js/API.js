import Axios from 'axios';

export async function getWorflowConfig(workflowId) {
  const workflowReq = Axios.get(apiBaseURL + 'api/workflows/' + workflowId);

  let workflowConfig = (await workflowReq).data;

  return workflowConfig
}

export async function postTransientDocument(file) {
  var formData = new FormData();
  formData.append('myfile', file);

  const apiResponse = Axios.post(apiBaseURL + 'api/postTransient', formData);

  let data = (await apiResponse).data;

  return data;
}
