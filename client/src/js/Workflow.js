import DynamicForm from './DynamicForm';
import * as API from './API';
import { APIException, HandledException, InternalServerError } from './util/Exceptions';

export default class Workflow {
  constructor(workflowId) {
    this.workflowId = workflowId;
    this.agreement_name = "";

    this.workflowConfig;
    this.dynamicForm;

    this.formHooks = {
      recipientGroups: [],
      carbonCopyGroups:  [],
      agreementName: null,
      message: null,
      files: [],
      mergeFields: [],
      passwordOption: null,
      expiration: null,
      reminder: null,
    }

    this.agreementData = null;
  }

  static async loadWorkflow(workflowId) {
    try {
      let workflowConfig = API.getWorflowConfig(workflowId);
      let wf = new Workflow(workflowId);

      wf.workflowConfig = await workflowConfig;

      return wf;
    }
    catch(e) {
      if(e instanceof APIException) {
        console.log(e.name,e.apiData)

        if(e.apiData.code) {
          if(e.apiData.code == "DISABLED_WORKFLOW") {
            throw new HandledException("Error", `The requested workflow is not currently available.`);
          }
          else if(e.apiData.code == "PERMISSION_DENIED") {
            throw new HandledException("Error", `The requested workflow is not currently available.`);
          }
          else if(e.apiData.code == "INVALID_WORKFLOW_ID") {
            throw new HandledException("Error", `The requested workflow could not be found.`);
          }
        }
      }
      else if(e instanceof InternalServerError) {
        console.log(e.name,e.message)

        throw new HandledException("Error", "Sorry, a server error has occured. Please try again later or contact adobesign@calpoly.edu for support.");
      }

      throw e;
    }
  }

  getWorkflowConfig() {
    return this.workflowConfig;
  }

  render(parentNode) {
    var dynamicForm = new DynamicForm(this.workflowConfig, this);
    dynamicForm.buildRecipientsForm(parentNode);

    this.dynamicForm = dynamicForm;
  }

  async submit() {
    let agreementData = {
      recipients: this.getReducedValues(this.formHooks.recipientGroups),
      carbonCopy: this.getReducedValues(this.formHooks.carbonCopyGroups),
      files: this.getReducedValues(this.formHooks.files),
      mergeFields: this.getReducedValues(this.formHooks.mergeFields),
    }

    if(this.formHooks.agreementName !== null) {
      agreementData.agreementName = this.formHooks.agreementName.getValues()
    }

    if(this.formHooks.message !== null) {
      agreementData.message = this.formHooks.message.getValues()
    }

    if(this.formHooks.passwordOption !== null) {
      agreementData.password = this.formHooks.passwordOption.getValues()
    }

    if(this.formHooks.expiration !== null) {
      agreementData.expiration = this.formHooks.expiration.getValues()
    }

    if(this.formHooks.reminder !== null) {
      let reminderValues = this.formHooks.reminder.getValues();
      if(reminderValues !== null) {
        agreementData.reminder = reminderValues;
      }
    }

    console.log(agreementData)
    this.agreementData = agreementData;

    let apiResponse = await API.postWorkflowAgreement(this.workflowId, agreementData);
    console.log("apiResponse", apiResponse);
  }

  getReducedValues(arr) {
    return arr.reduce((results, elm) => {
      let val = elm.getValues();
      if(val !== null) {
        results.push(val);
      }
      return results;
    }, []);
  }
}
