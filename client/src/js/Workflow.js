import DynamicForm from './DynamicForm';
import * as API from './API';

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
    let workflowConfig = API.getWorflowConfig(workflowId);
    let wf = new Workflow(workflowId);

    wf.workflowConfig = await workflowConfig;

    return wf;
  }

  getWorkflowConfig() {
    return this.workflowConfig;
  }

  render(parentNode) {
    var dynamicForm = new DynamicForm(this.workflowConfig, this);
    dynamicForm.buildRecipientsForm(parentNode);

    this.dynamicForm = dynamicForm;
  }

  submit() {
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

    let apiResponse = API.postWorkflowAgreement(this.workflowId, agreementData);
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
