import Axios from 'axios';

export async function getWorflowConfig(workflowId) {
  const workflowReq = Axios.get(apiBaseURL + 'api/workflows/' + workflowId);

  let workflowConfig = (await workflowReq).data;

  return workflowConfig
}
