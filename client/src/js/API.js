import Axios from 'axios';
import { APIException, InternalServerError } from './util/Exceptions';

const APIClient = Axios.create({
  baseURL: ClientConfig.apiBaseURL,
});

export async function getWorflowConfig(workflowId) {
  try {
    const workflowReq = await APIClient.get(`/api/workflows/${workflowId}`);
    return workflowReq.data;
  }
  catch(e) {
    if(e.response) {
      console.error(`API Error: ${e.response.status}`, e.name, e.response);
      if(e.response.data && e.response.data.code) {
        throw new APIException(e.response.data);
      }
      else if(e.response.status == 500) {
        throw new InternalServerError(e.response.data);
      }
    }

    console.error(e);
    throw e;
  }
}

export async function postTransientDocument(file) {
  var formData = new FormData();
  formData.append('myfile', file);

  const apiResponse = await APIClient.post(`/api/postTransient`, formData);
  return apiResponse.data;
}

export async function postWorkflowAgreement(workflowId, agreementData) {
  try {
    const apiResponse = await APIClient.post(`/api/workflows/${workflowId}/agreements`, agreementData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return apiResponse.data;
  }
  catch(e) {
    if(e.response) {
      console.error(`API Error: ${e.response.status}`, e.name, e.response);
      if(e.response.data && e.response.data.code) {
        throw new APIException(e.response.data);
      }
      else if(e.response.status == 500) {
        throw new InternalServerError(e.response.data);
      }
    }

    console.error(e);
    throw e;
  }
}
